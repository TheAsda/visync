import { loggerPlugin } from './loggerPlugin.js';
import server from './server.js';

await server.register(loggerPlugin);

server.listen({
  host: 'localhost',
  port: process.env.PORT ? Number(process.env.PORT) : 7001,
});
