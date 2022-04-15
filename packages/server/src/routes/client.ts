import type { FastifyPluginCallback } from 'fastify';
import { findRoomByClientId } from '../store/rooms';

export const clientRoutes: FastifyPluginCallback = (fastify) => {
  fastify.get('/client/:id', (request, reply) => {
    const clientId = (request.params as { id: string }).id;
    try {
      const room = findRoomByClientId(clientId);
      reply.send(room);
    } catch (err) {
      reply.status(400);
    }
  });
};
