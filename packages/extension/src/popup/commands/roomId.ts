import { createAsyncCommand } from '../../lib/async-command';

export const [getRoomId, handleRoomId] = createAsyncCommand<
  void,
  string | undefined
>('room-id');
