import { createAsyncCommand } from '../../lib/asyncCommand';

export interface RoomInfo {
  roomId: string;
  clients: string[];
}

export const [getRoomInfo, handleRoomInfo] = createAsyncCommand<string, RoomInfo>(
  'room-info'
);
