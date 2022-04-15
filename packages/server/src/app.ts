import Fastify from 'fastify';
import FastifyWebSocket from 'fastify-websocket';
import { clientRoutes } from './routes/client';
import { roomRoutes } from './routes/room';
import { socketRoutes } from './routes/socket';

const fastify = Fastify({
  logger: true,
});

fastify.register(FastifyWebSocket);
fastify.register(roomRoutes);
fastify.register(socketRoutes);
fastify.register(clientRoutes);

fastify.listen(7000);
