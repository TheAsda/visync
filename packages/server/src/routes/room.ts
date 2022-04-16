import type { FastifyPluginCallback } from 'fastify';
import type {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
} from 'syncboii-contracts';
import { createRoom, joinRoom, leaveRoom } from '../store/rooms';

export const roomRoutes: FastifyPluginCallback = async (fastify) => {
  fastify.post('/room/create', (request, reply) => {
    const body = request.body as CreateRoomRequest;

    const room = createRoom(body.clientId, body.link);

    reply.send(room);
  });

  fastify.post('/room/join', (request, reply) => {
    const body = request.body as JoinRoomRequest;

    try {
      const room = joinRoom(body.roomId, body.clientId);
      reply.send(room);
    } catch (err) {
      if (err instanceof Error) {
        request.log.error(err?.message);
      } else {
        request.log.error(err);
      }
      reply.status(400);
    }
  });

  fastify.post('/room/leave', (request, reply) => {
    const body = request.body as LeaveRoomRequest;

    try {
      const room = leaveRoom(body.clientId);
      reply.send(room);
    } catch (err) {
      if (err instanceof Error) {
        request.log.error(err?.message);
      } else {
        request.log.error(err);
      }
      reply.status(400);
    }
  });
};
