import { createAsyncCommand } from '../lib/async-command';

export interface RoomInfo {
  roomId: string;
  clients: string[];
}

export const [getRoomInfo, handleRoomInfo] = createAsyncCommand<string, RoomInfo>(
  'room-info'
);
