import { BehaviorSubject, fromEvent, merge, Subject, takeUntil } from 'rxjs';
import { startPinging } from '../messages/ping';
import { sendSync, SyncRequest, syncStream } from '../messages/sync';

const syncStream$ = new Subject<SyncRequest>();
syncStream.subscribe(([request]) => syncStream$.next(request));

let syncedVideo$: BehaviorSubject<HTMLVideoElement> | undefined;

export const startVideoSyncing = (video: HTMLVideoElement) => {
  syncedVideo$ = new BehaviorSubject(video);

  const onCompleted$ = new Subject<void>();
  merge(
    fromEvent(video, 'play'),
    fromEvent(video, 'pause'),
    fromEvent(video, 'seeked'),
    fromEvent(video, 'ratechange')
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

  syncStream$.pipe(takeUntil(onCompleted$)).subscribe((request) => {
    switch (request.type) {
      case 'play':
        video.play();
        break;
      case 'pause':
        video.pause();
        break;
      case 'rewind':
        video.currentTime = request.payload.time;
        break;
      case 'play-speed':
        video.playbackRate = request.payload.speed;
        break;
    }
  });

  const stopPinging = startPinging();

  syncedVideo$.subscribe({
    complete: () => {
      stopPinging();
      onCompleted$.next();
      onCompleted$.complete();
    },
  });
};

export const stopVideoSyncing = () => {
  syncedVideo$?.complete();
};
