import 'dotenv/config';
import Fastify from 'fastify';
import FastifyWebSocket from 'fastify-websocket';
import { loggerPlugin } from './loggerPlugin';
import { clientRoutes } from './routes/client';
import { roomRoutes } from './routes/room';
import { socketRoutes } from './routes/socket';

const fastify = Fastify({
  logger: false,
  requestTimeout: 2000,
});

fastify.register(loggerPlugin);
fastify.register(roomRoutes);
fastify.register(clientRoutes);
fastify.register(FastifyWebSocket);
fastify.register(socketRoutes);

fastify.listen(7000, '0.0.0.0');
