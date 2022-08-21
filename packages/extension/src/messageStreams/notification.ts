import { createMessageStream } from '../lib/runtime';
import { RuntimeMessage } from '../types/runtimeMessages';

export type SyncStartedNotification = RuntimeMessage<
  'sync-started',
  { videoSelector?: string }
>;
export type SyncStoppedNotification = RuntimeMessage<'sync-stopped'>;

export type Notification = SyncStartedNotification | SyncStoppedNotification;

export const [notification$, sendNotification] =
  createMessageStream<Notification>('notification');
