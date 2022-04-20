import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { logger } from './logger';

export const loggerPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.addHook('onReady', async () => {
    logger.info?.('App started');
  });

  fastify.addHook('onRequest', async (request) => {
    logger.info?.(`Request starting ${request.method} ${request.url}`);
  });

  fastify.addHook('onResponse', async (response, reply) => {
    logger.info?.(
      `Request finished ${response.method} ${response.url}: ${reply.statusCode}`
    );
  });
});
