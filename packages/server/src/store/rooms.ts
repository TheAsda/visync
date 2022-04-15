import { ClientId } from '../types/clientId';
import { Room } from '../types/room';
import { nanoid } from 'nanoid';

const rooms: Room[] = [];

const findRoom = (roomId: string): Room | undefined => {
  return rooms.find((room) => room.roomId === roomId);
};

export const createRoom = (clientId: ClientId, link: string): Room => {
  const roomId = nanoid(6);
  const room: Room = {
    roomId,
    link,
    clientIds: [clientId],
  };
  return room;
};

export const joinRoom = (roomId: string, clientId: ClientId): Room => {
  const room = findRoom(roomId);
  if (!room) {
    throw new Error('Room does not exit');
  }
  if (room.clientIds.includes(clientId)) {
    throw new Error('Client id is already in room');
  }
  room.clientIds.push(clientId);
  return room;
};

export const findRoomByClientId = (clientId: ClientId): Room => {
  const room = rooms.find((room) => room.clientIds.includes(clientId));
  if (!room) {
    throw new Error('Room does not exit');
  }
  return room;
};

export const leaveRoom = (roomId: string, clientId: ClientId): Room => {
  const room = findRoom(roomId);
  if (!room) {
    throw new Error('Room does not exit');
  }
  room.clientIds = room.clientIds.filter((id) => id !== clientId);
  return room;
};

export const deleteRoom = (roomId: string): void => {
  const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
  if (roomIndex !== -1) {
    throw new Error('Room does not exit');
  }
  rooms.splice(roomIndex, 1);
};
