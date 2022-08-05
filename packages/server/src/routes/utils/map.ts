import {
  Client as ClientResponse,
  Room as RoomResponse,
} from 'visync-contracts';
import { Client, Room } from '../../store/knex.js';

export const mapClient = (client: Client): ClientResponse => {
  return {
    clientId: client.clientId,
    roomId: client.roomId ?? undefined,
  };
};

export const mapRoom = (room: Room): RoomResponse => {
  return {
    roomId: room.roomId,
    link: room.link ?? undefined,
    clientIds: [],
  };
};
