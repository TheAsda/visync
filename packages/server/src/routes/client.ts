import type { FastifyPluginCallback } from 'fastify';
import { getRoomByClientId } from '../store/rooms';

export const clientRoutes: FastifyPluginCallback = async (fastify) => {
  fastify.get('/client/:id', (request, reply) => {
    const clientId = (request.params as { id: string }).id;
    try {
      const room = getRoomByClientId(clientId);
      reply.send(room);
    } catch (err) {
      if (err instanceof Error) {
        request.log.warn(err.message);
      }
      reply.code(400).send();
    }
  });
};
