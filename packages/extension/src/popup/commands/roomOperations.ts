import { createAsyncCommand } from '../../lib/async-command';

export const [createRoom, handleCreateRoom] = createAsyncCommand<void, string>(
  'create-room'
);

export const [joinRoom, handleJoinRoom] = createAsyncCommand<string, string>(
  'join-room'
);

export const [leaveRoom, handleLeaveRoom] = createAsyncCommand<string>(
  'leave-room'
);
