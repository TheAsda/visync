import { ClientId } from './clientId';

export type Room = {
  roomId: string;
  link: string;
  clientIds: ClientId[];
};
