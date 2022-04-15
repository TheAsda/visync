import Fastify from 'fastify';
import FastifyWebSocket from 'fastify-websocket';
import { roomRoutes } from './routes/room';
import { socketRoutes } from './routes/socket';

const fastify = Fastify({
  logger: true,
});

fastify.register(FastifyWebSocket);
fastify.register(roomRoutes);
fastify.register(socketRoutes);

fastify.listen(7000);
