import type { FastifyPluginAsync } from 'fastify';
import type {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
} from 'syncboii-contracts';
import { logger } from '../logger';
import { createRoom, deleteRoom, joinRoom, leaveRoom } from '../store/rooms';

export const roomRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/room/create', (request, reply) => {
    const body = request.body as CreateRoomRequest;

    const room = createRoom(body.clientId);

    reply.status(201).send(room);
  });

  fastify.post('/room/join', (request, reply) => {
    const body = request.body as JoinRoomRequest;

    try {
      const room = joinRoom(body.roomId, body.clientId);
      reply.send(room);
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

  fastify.post('/room/leave', (request, reply) => {
    const body = request.body as LeaveRoomRequest;

    try {
      const room = leaveRoom(body.clientId);
      if (room.clientIds.length === 0) {
        deleteRoom(room.roomId);
      }
      reply.status(204).send();
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
