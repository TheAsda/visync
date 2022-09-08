import {
  BehaviorSubject,
  filter,
  fromEvent,
  map,
  merge,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { startPinging } from '../messageStreams/ping';
import { sync$, sendSync } from '../messageStreams/sync';

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
    .pipe(takeUntil(onCompleted$))
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
