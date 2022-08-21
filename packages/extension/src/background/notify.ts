import { sendNotification } from '../messageStreams/notification';

export const notifySyncStarted = (tabId: number, videoSelector?: string) => {
  sendNotification(
    {
      type: 'sync-started',
      payload: {
        videoSelector: videoSelector,
      },
    },
    tabId
  );
};

export const notifySyncStopped = (tabId: number) => {
  sendNotification(
    {
      type: 'sync-stopped',
    },
    tabId
  );
};
