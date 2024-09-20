import { createAsyncCommand } from '../lib/async-message';

export const [createRoom, handleCreateRoom] = createAsyncCommand<void, string>(
  'create-room'
);

export const [joinRoom, handleJoinRoom] = createAsyncCommand<string, string>(
  'join-room'
);

export const [leaveRoom, handleLeaveRoom] = createAsyncCommand<string, void>(
  'leave-room'
);
