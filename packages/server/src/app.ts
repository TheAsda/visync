import 'dotenv/config';
import Fastify from 'fastify';
import FastifyWebSocket from '@fastify/websocket';
import { loggerPlugin } from './loggerPlugin';
import { clientsRoutes } from './routes/clients';
import { roomsRoutes } from './routes/rooms';
import { socketRoutes } from './routes/socket';

const fastify = Fastify({
  logger: false,
  requestTimeout: 2000,
});

fastify.register(loggerPlugin);
fastify.register(roomsRoutes);
fastify.register(clientsRoutes);
fastify.register(FastifyWebSocket);
fastify.register(socketRoutes);

fastify.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 7001,
});
