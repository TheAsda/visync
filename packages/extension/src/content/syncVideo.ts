import {
  BehaviorSubject,
  bufferToggle,
  delay,
  filter,
  fromEvent,
  map,
  merge,
  mergeMap,
  of,
  OperatorFunction,
  pipe,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { startPinging } from '../messageStreams/ping';
import { sendSync, sync$ } from '../messageStreams/sync';

let syncedVideo$: BehaviorSubject<HTMLVideoElement> | undefined;

export const startVideoSyncing = (video: HTMLVideoElement) => {
  if (syncedVideo$) {
    console.warn('Video is already synced');
    syncedVideo$.complete();
  }

  syncedVideo$ = new BehaviorSubject(video);
  const lastSeeked$ = new BehaviorSubject<number | undefined>(undefined);
  const lastPlaySpeed$ = new BehaviorSubject<number | undefined>(undefined);

  const onCompleted$ = new Subject<void>();

  merge(
    fromEvent(video, 'play'),
    fromEvent(video, 'pause'),
    fromEvent(video, 'seeked').pipe(
      filter(() => lastSeeked$.getValue() !== video.currentTime),
      tap(() => lastSeeked$.next(undefined))
    ),
    fromEvent(video, 'ratechange').pipe(
      filter(() => lastPlaySpeed$.getValue() !== video.currentTime),
      tap(() => lastPlaySpeed$.next(undefined))
    )
  )
    .pipe(
      takeUntil(onCompleted$),
      buffer(200),
      map((events) => {
        const eventTypes = events.map((e) => e.type);
        if (eventTypes.includes('play') && eventTypes.includes('pause')) {
          console.log('Ignoring play/pause events');
          const plays = events.filter((e) => e.type === 'play').length;
          const pauses = events.filter((e) => e.type === 'pause').length;
          const otherEvents = events.filter(
            (e) => e.type !== 'play' && e.type !== 'pause'
          );
          if (plays === pauses) {
            return otherEvents;
          }
          if (plays > pauses) {
            return [...otherEvents, events.find((e) => e.type === 'play')!];
          } else {
            return [...otherEvents, events.find((e) => e.type === 'pause')!];
          }
        }
        return events;
      }),
      mergeMap((events) => of(...events))
    )
    .subscribe((event) => {
      switch (event.type) {
        case 'play':
        case 'pause':
          sendSync({ type: event.type });
          break;
        case 'seeked':
          sendSync({ type: 'rewind', payload: { time: video.currentTime } });
          break;
        case 'ratechange':
          sendSync({
            type: 'play-speed',
            payload: { speed: video.playbackRate },
          });
          break;
      }
    });

  sync$
    .pipe(
      takeUntil(onCompleted$),
      map(({ message }) => message)
    )
    .subscribe((message) => {
      switch (message.type) {
        case 'play':
          video.play();
          break;
        case 'pause':
          video.pause();
          break;
        case 'rewind':
          lastSeeked$.next(message.payload.time);
          video.currentTime = message.payload.time;
          break;
        case 'play-speed':
          lastPlaySpeed$.next(message.payload.speed);
          video.playbackRate = message.payload.speed;
          break;
      }
    });

  const stopPinging = startPinging();

  syncedVideo$.subscribe({
    complete: () => {
      stopPinging();
      onCompleted$.next();
      onCompleted$.complete();
      lastSeeked$.complete();
      lastPlaySpeed$.complete();
    },
  });
};

export const stopVideoSyncing = () => {
  syncedVideo$?.complete();
};

const buffer = <T>(bufferTime: number): OperatorFunction<T, T[]> => {
  const start$ = new Subject<void>();
  let isBuffering = false;
  return pipe(
    tap<T>(() => {
      if (!isBuffering) {
        start$.next();
        isBuffering = true;
      }
    }),
    bufferToggle(start$, () => {
      return of(true).pipe(
        delay(bufferTime),
        tap(() => {
          isBuffering = false;
        })
      );
    })
  );
};
