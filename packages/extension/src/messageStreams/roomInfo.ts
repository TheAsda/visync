import { createAsyncCommand } from '../lib/async-message';

export interface RoomInfo {
  roomId: string;
  clients: string[];
}

export const [getRoomInfo, handleRoomInfo] = createAsyncCommand<string, RoomInfo>(
  'room-info'
);
