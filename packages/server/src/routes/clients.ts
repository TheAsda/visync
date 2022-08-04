import type { FastifyPluginAsync } from 'fastify';
import { Client } from '../store/knex.js';

export const clientsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.put('/clients/:clientId', async (request, reply) => {
    const { clientId } = request.params as { clientId: string };

    const client = await fastify.knex
      .table<Client>('client')
      .where('clientId', clientId)
      .first();

    if (client) {
      reply.code(400).send({
        error: `Client ${clientId} already registered`,
      });
      return;
    }

    await fastify.knex.table<Client>('client').insert({ clientId });
    // TODO: change to returning when knex will be updated
    const createdClient = await fastify.knex
      .table<Client>('client')
      .where('clientId', clientId)
      .first();

    reply.code(201).send(createdClient);
  });

  fastify.get('/clients/:clientId', async (request, reply) => {
    const { clientId } = request.params as { clientId: string };

    const client = await fastify.knex
      .table<Client>('client')
      .where('clientId', clientId)
      .first();

    if (!client) {
      reply.code(404).send({
        error: `Client ${clientId} not found`,
      });
      return;
    }

    reply.send(client);
  });
};
