import FastifyWebSocket from '@fastify/websocket';
import 'dotenv/config';
import Fastify from 'fastify';
import { clientsRoutes } from './routes/clients.js';
import { roomsRoutes } from './routes/rooms.js';
import { socketRoutes } from './routes/socket.js';
import { knexPlugin } from './store/knex.js';

const fastify = Fastify.default({
  logger: false,
  requestTimeout: 2000,
});

await fastify.register(knexPlugin);
await fastify.register(roomsRoutes);
await fastify.register(clientsRoutes);
await fastify.register(FastifyWebSocket.default);
await fastify.register(socketRoutes);

export default fastify;
