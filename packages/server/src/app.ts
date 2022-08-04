import { loggerPlugin } from './loggerPlugin.js';
import server from './server.js';

await server.register(loggerPlugin);

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 7001,
});
