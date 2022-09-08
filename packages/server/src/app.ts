import { logger } from './logger.js';
import { loggerPlugin } from './loggerPlugin.js';
import server from './server.js';

await server.register(loggerPlugin);

server
  .listen({
    host: process.env.HOST ?? 'localhost',
    port: process.env.PORT ? Number(process.env.PORT) : 7001,
  })
  .then((address) => {
    logger.info(`Server listening on ${address}`);
  });
