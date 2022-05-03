import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { once } from 'ws';
import { logger } from './logger';

export const loggerPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.addHook('onReady', async () => {
    logger.info('Application started');
  });

  fastify.addHook('onRequest', async (request) => {
    if (request.url === '/log') {
      return;
    }
    logger.info(`Request starting ${request.method} ${request.url}`);
  });

  fastify.addHook('onResponse', async (response, reply) => {
    if (response.url === '/log') {
      return;
    }
    const message = `Request finished ${response.method} ${response.url}: ${reply.statusCode}`;
    if (reply.statusCode >= 500) {
      logger.error(message);
      return;
    }
    if (reply.statusCode >= 400) {
      logger.warn(message);
      return;
    }
    logger.info(message);
  });

  fastify.addHook('onClose', async () => {
    logger.warn('Application shutdown');
    await once(logger, 'cleared');
  });
});
