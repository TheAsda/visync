import { Elysia } from 'elysia';
import logixlysia from 'logixlysia';
import server from './server.js';

new Elysia()
  .use(logixlysia())
  .use(server)
  .listen({
    hostname: process.env.HOST ?? '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 23778,
  });
