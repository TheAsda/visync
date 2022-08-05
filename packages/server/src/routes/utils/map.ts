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

export const mapRoom = (
  room: (Room & Pick<Client, 'clientId'>)[]
): RoomResponse => {
  return {
    roomId: room[0].roomId,
    link: room[0].link ?? undefined,
    clientIds: room.map((c) => c.clientId),
  };
};
