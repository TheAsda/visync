import { Elysia } from 'elysia';
import { clientRoutes } from './routes/clients.js';
import { roomsRoutes } from './routes/rooms.js';
import { socketRoutes } from './routes/socket.js';

const app = new Elysia().use(clientRoutes).use(socketRoutes).use(roomsRoutes);

export default app;
export type Server = typeof app;
