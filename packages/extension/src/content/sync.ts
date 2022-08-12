import { fromEvent, Subject } from 'rxjs';
import {
  combineLatestWith,
  defaultIfEmpty,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { startPinging } from '../messages/ping';
import {
  PlaySpeedRequest,
  RewindRequest,
  sendSync,
  SyncRequest,
  syncStream,
} from '../messages/sync';

const syncStream$ = new Subject<SyncRequest>();
syncStream.subscribe(([request]) => syncStream$.next(request));
const contextMenuStream = fromEvent(document, 'contextmenu').pipe(
  map((e) => e.target as HTMLElement)
);
const syncedVideo$ = new Subject<HTMLVideoElement>();

syncStream$
  .pipe(
    filter(
      (request) =>
        request.type === 'sync-started' && !!request.payload.videoSelector
    )
  )
  .subscribe((request) => {
    if (request.type !== 'sync-started' || !request.payload.videoSelector) {
      return;
    }
    const video = document.querySelector(
      request.payload.videoSelector
    ) as HTMLVideoElement;
    if (!video) {
      throw new Error('Video not found');
    }
    if (video.tagName !== 'VIDEO') {
      throw new Error('Target is not a video');
    }
    syncedVideo$.next(video);
  });

syncStream$
  .pipe(
    filter(
      (request) =>
        request.type === 'sync-started' && !request.payload.videoSelector
    ),
    combineLatestWith(contextMenuStream)
  )
  .subscribe(([request, target]) => {
    const video = target as HTMLVideoElement;
    if (video.tagName !== 'VIDEO') {
      throw new Error('Target is not a video');
    }
    syncedVideo$.next(video);
  });

syncStream$
  .pipe(filter((request) => request.type === 'sync-stopped'))
  .subscribe(() => {
    syncStream$.complete();
    syncedVideo$.complete();
  });

syncStream$
  .pipe(
    filter((request) => request.type === 'play'),
    combineLatestWith(syncedVideo$),
    map(([request, video]) => video)
  )
  .subscribe((video) => {
    video.play();
  });

syncStream$
  .pipe(
    filter((request) => request.type === 'pause'),
    combineLatestWith(syncedVideo$),
    map(([request, video]) => video)
  )
  .subscribe((video) => {
    video.pause();
  });

syncStream$
  .pipe(
    filter((request) => request.type === 'rewind'),
    map((request) => (request as RewindRequest).payload.time),
    combineLatestWith(syncedVideo$)
  )
  .subscribe(([time, video]) => {
    skipNextSeeked = true;
    video.currentTime = time;
  });

syncStream$
  .pipe(
    filter((request) => request.type === 'play-speed'),
    map((request) => (request as PlaySpeedRequest).payload.speed),
    combineLatestWith(syncedVideo$)
  )
  .subscribe(([speed, video]) => {
    video.playbackRate = speed;
  });

let stopPinging = () => {};
syncedVideo$.subscribe({
  next: () => {
    stopPinging = startPinging();
  },
  complete: () => {
    stopPinging();
  },
});

syncedVideo$
  .pipe(switchMap((video) => fromEvent(video, 'play')))
  .subscribe(() => {
    sendSync({
      type: 'play',
    });
  });

syncedVideo$
  .pipe(switchMap((video) => fromEvent(video, 'pause')))
  .subscribe(() => {
    sendSync({
      type: 'pause',
    });
  });

// NOTE: this is a hack to skip seeked event when video has been rewound by script
let skipNextSeeked = false;

syncedVideo$
  .pipe(
    switchMap((video) => fromEvent(video, 'seeked')),
    map((e) => (e.target as HTMLVideoElement).currentTime),
    filter(() => {
      if (skipNextSeeked) {
        skipNextSeeked = false;
        return false;
      }
      return true;
    })
  )
  .subscribe((time) => {
    sendSync({ type: 'rewind', payload: { time } });
  });

syncedVideo$
  .pipe(
    switchMap((video) => fromEvent(video, 'ratechange')),
    map((e) => (e.target as HTMLVideoElement).playbackRate)
  )
  .subscribe((speed) => {
    sendSync({
      type: 'play-speed',
      payload: { speed },
    });
  });
