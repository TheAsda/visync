import { createMessageStream } from '../lib/runtime';
import { RuntimeMessage } from '../types/runtimeMessages';

export type StartSyncCommand = RuntimeMessage<
  'start-sync',
  { videoSelector: string }
>;
export type StopSyncCommand = RuntimeMessage<'stop-sync'>;
export type CreateRoomCommand = RuntimeMessage<'create-room'>;
export type JoinRoomCommand = RuntimeMessage<'join-room', { roomId: string }>;
export type LeaveRoomCommand = RuntimeMessage<'leave-room'>;
/** Command for getting latest values for other streams
 *  such as clientId, roomId, isSynced, settings */
export type GetStatusCommand = RuntimeMessage<'get-status'>;

export type Command =
  | StartSyncCommand
  | StopSyncCommand
  | CreateRoomCommand
  | JoinRoomCommand
  | LeaveRoomCommand
  | GetStatusCommand;

export const [command$, sendCommand] = createMessageStream<Command>('command');
