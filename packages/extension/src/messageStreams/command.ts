import { filter, Observable } from 'rxjs';
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
export type GetClientIdCommand = RuntimeMessage<'get-client-id'>;
export type GetRoom = RuntimeMessage<'get-room'>;
export type GetVideosOnPageCommand = RuntimeMessage<'get-videos-on-page'>;

export type Command =
  | StartSyncCommand
  | StopSyncCommand
  | CreateRoomCommand
  | JoinRoomCommand
  | LeaveRoomCommand
  | GetClientIdCommand
  | GetRoom
  | GetVideosOnPageCommand;

export const [command$, sendCommand] = createMessageStream<Command>('command');

type ObservableType<T> = T extends Observable<infer U> ? U : never;

type CommandType = Command['type'];

export const filterCommand = (type: CommandType | CommandType[]) => {
  if (Array.isArray(type)) {
    return filter<ObservableType<typeof command$>>(({ message }) =>
      type.includes(message.type)
    );
  }
  return filter<ObservableType<typeof command$>>(
    ({ message }) => message.type === type
  );
};
