import { Room } from './room';

export type CreateRoomRequest = {
  clientId: string;
};

export type JoinRoomRequest = {
  roomId: string;
  clientId: string;
};

export type LeaveRoomRequest = {
  clientId: string;
};

export type ClientStatus = {
  room?: Room;
  isSynced: boolean;
};
