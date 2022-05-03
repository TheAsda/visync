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
  trace: logger.trace.bind(logger),
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
};
