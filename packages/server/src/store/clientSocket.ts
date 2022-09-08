import fp from 'fastify-plugin';
import type { WebSocket } from 'ws';

export const clientSocketPlugin = fp.default(async (fastify) => {
  fastify.decorate('clientSockets', {});
});
declare module 'fastify' {
  interface FastifyInstance {
    clientSockets: Record<string, WebSocket>;
  }
}
