import { getMessage } from '@extend-chrome/messages';
import { Subject } from 'rxjs';
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
export type StartSyncRequest = RuntimeMessage<
  'start-sync',
  { videoSelector: string }
>;
export type StopSyncRequest = RuntimeMessage<'stop-sync'>;

export type SyncRequest =
  | PlayRequest
  | PauseRequest
  | RewindRequest
  | PlaySpeedRequest
  | SyncStartedRequest
  | SyncStoppedRequest
  | StartSyncRequest
  | StopSyncRequest;

const [sendSync, syncStream, waitForSync] = getMessage<SyncRequest>('sync');

const syncStream$ = new Subject<[SyncRequest, chrome.runtime.MessageSender]>();
// NOTE: this is a hack to get around the fact that the syncStream uses older rxjs version
syncStream.subscribe((value) => syncStream$.next(value));

export { sendSync, waitForSync, syncStream$ as syncStream };
