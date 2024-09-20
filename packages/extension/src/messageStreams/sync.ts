import { createMessageStream } from '../lib/message-stream';
import { RuntimeMessage } from '../types/runtimeMessages';

export type PlayMessage = RuntimeMessage<'play'>;
export type PauseMessage = RuntimeMessage<'pause'>;
export type RewindMessage = RuntimeMessage<'rewind', { time: number }>;
export type PlaySpeedMessage = RuntimeMessage<'play-speed', { speed: number }>;

export type SyncMessage =
  | PlayMessage
  | PauseMessage
  | RewindMessage
  | PlaySpeedMessage;

export const [sync$, sendSync] = createMessageStream<SyncMessage>('sync');
