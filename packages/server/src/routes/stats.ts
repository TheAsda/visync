import { FastifyPluginAsync } from 'fastify';
import { Stats } from 'visync-contracts';
import { Client, Room } from '../store/knex.js';

export const statsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/stats', async (request, reply) => {
    const roomsCount = await fastify.knex
      .table<Room>('room')
      .count<{ count: number }>('roomId', { as: 'count' })
      .first()
      .then((r) => r?.count ?? 0);
    const clientsCount = await fastify.knex
      .table<Client>('client')
      .count<{ count: number }>('clientId', { as: 'count' })
      .first()
      .then((r) => r?.count ?? 0);

    const stats: Stats = {
      roomsCount,
      clientsCount,
      socketsCount: Object.keys(fastify.clientSockets).length,
    };

    reply.send(stats);
  });
};
