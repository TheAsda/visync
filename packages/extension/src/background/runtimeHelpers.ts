import { sendSync } from '../messages/sync';

export const notifySyncStarted = (tabId: number, videoSelector?: string) => {
  sendSync(
    {
      type: 'sync-started',
      payload: {
        videoSelector: videoSelector,
      },
    },
    { tabId }
  );
};

export const notifySyncStopped = (tabId: number) => {
  sendSync(
    {
      type: 'sync-stopped',
    },
    { tabId }
  );
};
