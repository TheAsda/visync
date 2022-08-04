import type { Room } from 'visync-contracts';
import { nanoid } from 'nanoid';
import { logger as defaultLogger } from '../logger.js';

const logger = defaultLogger.child({
  store: 'rooms',
});

const rooms: Room[] = [];

const findRoom = (roomId: string): Room | undefined => {
  return rooms.find((room) => room.roomId === roomId);
};

export const createRoom = (clientId: string): Room => {
  logger.debug(`Creating room for ${clientId}`);
  const roomId = nanoid(6);
  const room: Room = {
    roomId,
    clientIds: [clientId],
  };
  rooms.push(room);
  logger.debug(`Room ${roomId} created`);
  return room;
};

export const joinRoom = (roomId: string, clientId: string): Room => {
  logger.debug(`${clientId} joining ${roomId}`);
  const room = findRoom(roomId);
  if (!room) {
    throw new Error('Room does not exit');
  }
  if (room.clientIds.includes(clientId)) {
    throw new Error('Client id is already in room');
  }
  room.clientIds.push(clientId);
  logger.debug(`${clientId} joined ${roomId}`);
  return room;
};

export const getRoomByClientId = (clientId: string): Room => {
  const room = rooms.find((room) => room.clientIds.includes(clientId));
  if (!room) {
    throw new Error('Room does not exit');
  }
  return room;
};

export const leaveRoom = (clientId: string): Room => {
  logger.debug(`${clientId} leaving room`);
  const room = getRoomByClientId(clientId);
  room.clientIds = room.clientIds.filter((id) => id !== clientId);
  logger.debug(`${clientId} leaved ${room.roomId}`);
  return room;
};

export const deleteRoom = (roomId: string): void => {
  logger.debug(`Deleting ${roomId}`);
  const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
  if (roomIndex === -1) {
    throw new Error('Room does not exit');
  }
  rooms.splice(roomIndex, 1);
};

export const getRooms = () => {
  return rooms;
};
