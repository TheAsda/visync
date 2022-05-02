import { FastifyPluginAsync } from 'fastify';
import { LogRequest } from 'visync-contracts';
import { logger } from '../logger';

export const logRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/log', (request, reply) => {
    const body = request.body as LogRequest;

    const log = loggers[body.level] ?? loggers.info;

    log(body.message, { meta: body.meta, app: body.app });

    reply.status(201).send();
  });
};

const loggers = {
  trace: logger.trace,
  debug: logger.debug,
  info: logger.info,
  warn: logger.warn,
  error: logger.error,
  fatal: logger.fatal,
};
