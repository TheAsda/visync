import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import ws from 'ws';
import { logger } from './logger.js';

export const loggerPlugin: FastifyPluginAsync = fp.default(async (fastify) => {
  fastify.addHook('onReady', async () => {
    logger.info(`Application started`);
  });

  fastify.addHook('onRequest', async (request) => {
    logger.info(`Request starting ${request.method} ${request.url}`);
  });

  fastify.addHook('onResponse', async (response, reply) => {
    const message = `Request finished ${response.method} ${response.url}: ${reply.statusCode}`;
    logger.info(message);
  });

  fastify.addHook('onClose', async () => {
    logger.warn('Application shutdown');
    await ws.once(logger, 'cleared');
  });
});
