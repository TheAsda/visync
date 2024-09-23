import { createEventStream } from '../lib/event-stream';
import { RuntimeMessage } from '../types/runtimeMessages';

export type SyncStartedNotification = RuntimeMessage<
  'sync-started',
  { videoSelector?: string }
>;
export type SyncStoppedNotification = RuntimeMessage<'sync-stopped'>;

export type Notification = SyncStartedNotification | SyncStoppedNotification;

export const [notification$, sendNotification] =
  createEventStream<Notification>('notification');
