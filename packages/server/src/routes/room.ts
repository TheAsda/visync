import type { FastifyPluginAsync } from 'fastify';
import type {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
  Room,
  SocketResponse,
} from 'visync-contracts';
import { logger } from '../logger';
import { getSocket } from '../store/clientSocket';
import { createRoom, deleteRoom, joinRoom, leaveRoom } from '../store/rooms';
import { retry } from '../utils/retry';

export const roomRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/room/create', (request, reply) => {
    const body = request.body as CreateRoomRequest;

    const room = createRoom(body.clientId);

    reply.status(201).send(room);
  });

  fastify.post('/room/join', async (request, reply) => {
    const body = request.body as JoinRoomRequest;

    try {
      const room = joinRoom(body.roomId, body.clientId);
      reply.send(room);
      const response: SocketResponse = {
        type: 'room',
        payload: room,
      };
      await translateToOthersInRoom(room, body.clientId, response);
    } catch (err) {
      if (err instanceof Error) {
        logger.error(err?.message);
        reply.code(400).send();
      } else {
        logger.error(`Unknown error occurred: ${err}`);
        reply.code(500).send();
      }
    }
  });

  fastify.post('/room/leave', async (request, reply) => {
    const body = request.body as LeaveRoomRequest;

    try {
      const room = leaveRoom(body.clientId);
      if (room.clientIds.length === 0) {
        deleteRoom(room.roomId);
      }
      reply.status(204).send();
      const response: SocketResponse = {
        type: 'room',
        payload: room,
      };
      await translateToOthersInRoom(room, body.clientId, response);
    } catch (err) {
      if (err instanceof Error) {
        logger.error(err?.message);
        reply.code(400).send();
      } else {
        logger.error(`Unknown error occurred: ${err}`);
        reply.code(500).send();
      }
    }
  });
};

const translateToOthersInRoom = async (
  room: Room,
  clientId: string,
  response: SocketResponse
) => {
  logger.debug(`Translating response from ${clientId} to others in room`);
  const otherClientIds = room.clientIds.filter((id) => id !== clientId);
  const message = JSON.stringify(response);
  const promises = [];
  for (const clientId of otherClientIds) {
    const sendResponse = () => {
      getSocket(clientId).send(message);
    };
    promises.push(retry(sendResponse));
  }
  return Promise.all(promises);
};
