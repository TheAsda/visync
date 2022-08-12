import { BehaviorSubject, fromEvent } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import {
  SyncStartedRequest,
  SyncStoppedRequest,
  syncStream,
} from '../messages/sync';
import { startVideoSyncing, stopVideoSyncing } from './syncVideo';

const syncStream$ = syncStream.pipe(
  map(([request]) => request),
  filter(
    (request): request is SyncStartedRequest | SyncStoppedRequest =>
      request.type === 'sync-started' || request.type === 'sync-stopped'
  )
);

const contextMenuTarget$ = new BehaviorSubject<HTMLElement | undefined>(
  undefined
);
fromEvent(document, 'contextmenu')
  .pipe(map((e) => e.target as HTMLElement))
  .subscribe((target) => {
    contextMenuTarget$.next(target);
  });

syncStream$
  .pipe(
    filter(
      (request): request is SyncStartedRequest =>
        request.type === 'sync-started'
    ),
    withLatestFrom(contextMenuTarget$)
  )
  .subscribe(([request, target]) => {
    let video: HTMLVideoElement;
    if (request.payload.videoSelector) {
      video = document.querySelector(
        request.payload.videoSelector
      ) as HTMLVideoElement;
    } else {
      video = target as HTMLVideoElement;
    }
    if (!video) {
      throw new Error('Video not found');
    }
    if (video.tagName !== 'VIDEO') {
      throw new Error('Target is not a video');
    }
    startVideoSyncing(video);
  });

syncStream$
  .pipe(filter((request) => request.type === 'sync-stopped'))
  .subscribe(() => {
    stopVideoSyncing();
  });
