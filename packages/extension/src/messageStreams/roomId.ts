import { createAsyncCommand } from '../lib/async-message';

export const [getRoomId, handleRoomId] = createAsyncCommand<
  void,
  string | undefined
>('room-id');
