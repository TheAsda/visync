// import { BehaviorSubject, fromEvent } from 'rxjs';
// import { filter, map, withLatestFrom } from 'rxjs/operators';
// import {
//   notification$,
//   SyncStartedNotification,
//   SyncStoppedNotification,
// } from '../messageStreams/notification';
// import '../messageStreams/sync';
// import { startVideoSyncing, stopVideoSyncing } from './syncVideo';

// notification$
//   .pipe(
//     map(({ message }) => message),
//     filter(
//       (notification): notification is SyncStartedNotification =>
//         notification.type === 'sync-started'
//     ),
//     withLatestFrom(contextMenuTarget$)
//   )
//   .subscribe(([request, target]) => {
//     let video: HTMLVideoElement;
//     if (request.payload.videoSelector) {
//       video = document.querySelector(
//         request.payload.videoSelector
//       ) as HTMLVideoElement;
//     } else {
//       video = target as HTMLVideoElement;
//     }
//     if (!video) {
//       throw new Error('Video not found');
//     }
//     if (video.tagName !== 'VIDEO') {
//       throw new Error('Target is not a video');
//     }
//     startVideoSyncing(video);
//   });

// notification$
//   .pipe(
//     map(({ message }) => message),
//     filter(
//       (notification): notification is SyncStoppedNotification =>
//         notification.type === 'sync-stopped'
//     )
//   )
//   .subscribe(() => {
//     stopVideoSyncing();
//   });
