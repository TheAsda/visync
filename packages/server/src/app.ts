import Fastify from 'fastify';
import FastifyWebSocket from 'fastify-websocket';
import { clientRoutes } from './routes/client';
import { roomRoutes } from './routes/room';
import { socketRoutes } from './routes/socket';

const fastify = Fastify({
  logger: { prettyPrint: true },
  requestTimeout: 2000,
});

fastify.register(roomRoutes);
fastify.register(clientRoutes);
fastify.register(FastifyWebSocket);
fastify.register(socketRoutes);

fastify.listen(7000);
