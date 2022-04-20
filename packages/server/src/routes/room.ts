import type { FastifyPluginAsync } from 'fastify';
import type {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
} from 'syncboii-contracts';
import { createRoom, deleteRoom, joinRoom, leaveRoom } from '../store/rooms';

export const roomRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/room/create', (request, reply) => {
    const body = request.body as CreateRoomRequest;

    const room = createRoom(body.clientId);

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
      reply.code(400).send();
    }
  });

  fastify.post('/room/leave', (request, reply) => {
    const body = request.body as LeaveRoomRequest;

    try {
      const room = leaveRoom(body.clientId);
      if (room.clientIds.length === 0) {
        deleteRoom(room.roomId);
      }
      reply.send();
    } catch (err) {
      if (err instanceof Error) {
        request.log.error(err?.message);
      } else {
        request.log.error(err);
      }
      reply.status(400).send();
    }
  });
};
