import { createAsyncCommand } from '../lib/async-message';

export const [createRoom, handleCreateRoom] = createAsyncCommand<void, string>(
  'create-room'
);
