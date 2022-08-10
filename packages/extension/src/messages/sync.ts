import { getMessage } from '@extend-chrome/messages';
import { RuntimeMessage } from '../types/runtimeMessages';

export type PlayRequest = RuntimeMessage<'play'>;
export type PauseRequest = RuntimeMessage<'pause'>;
export type RewindRequest = RuntimeMessage<'rewind', { time: number }>;
export type PlaySpeedRequest = RuntimeMessage<'play-speed', { speed: number }>;
export type SyncStartedRequest = RuntimeMessage<
  'sync-started',
  { videoSelector?: string }
>;
export type SyncStoppedRequest = RuntimeMessage<'sync-stopped'>;

export type SyncRequest =
  | PlayRequest
  | PauseRequest
  | RewindRequest
  | PlaySpeedRequest
  | SyncStartedRequest
  | SyncStoppedRequest;

export const [sendSync, syncStream, waitForSync] =
  getMessage<SyncRequest>('sync');
