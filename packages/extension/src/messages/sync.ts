import { getMessage } from '@extend-chrome/messages';
import { RuntimeMessage } from '../types/runtimeMessages';

export type RewindRequest = RuntimeMessage<'rewind', { time: number }>;
export type PlaySpeedRequest = RuntimeMessage<'play-speed', { speed: number }>;

export type SyncRequest =
  | RuntimeMessage<'play'>
  | RuntimeMessage<'pause'>
  | RewindRequest
  | PlaySpeedRequest
  | RuntimeMessage<'sync-started'>
  | RuntimeMessage<'sync-stopped'>;

export const [sendSync, syncStream, waitForSync] =
  getMessage<SyncRequest>('sync');
