import { Room } from './room';
import { LogLevel } from '@logdna/logger';

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

export type LogRequest = {
  level: keyof typeof LogLevel;
  message: string;
  app?: string;
  meta?: any;
};
