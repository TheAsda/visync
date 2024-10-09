import { createAsyncCommand } from '../../lib/asyncCommand';

export const [getRoomId, handleRoomId] = createAsyncCommand<
  void,
  string | undefined
>('room-id');
