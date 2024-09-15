import { ServerWebSocket } from 'bun';
import { eq } from 'drizzle-orm';
import { Elysia, error, t } from 'elysia';
import db from '../store/db.js';
import { clients } from '../store/schema.js';

export const socketRoutes = new Elysia()
  .state('clientSockets', new Map<string, ServerWebSocket<unknown>>())
  .guard({
    params: t.Object({
      roomId: t.String(),
    }),
    headers: t.Object({
      'X-ClientId': t.String(),
    }),
  })
  .derive(
    async ({
      headers: { 'X-ClientId': clientId },
      store: { clientSockets },
    }) => {
      const client = await db.query.clients.findFirst({
        where: eq(clients.clientId, clientId!),
        with: {
          room: {
            with: {
              clients: true,
            },
          },
        },
      });
      if (!client) {
        return error(400, 'Client does not exist');
      }
      if (!client.roomId) {
        return error(400, 'Client is not in a room');
      }
      if (!client.room) {
        return error(400, 'Room does not exist');
      }
      const notifyOthersInRoom = (message: object) => {
        for (const c of client.room!.clients) {
          if (c.clientId === client.clientId) {
            continue;
          }
          const socket = clientSockets.get(c.clientId);
          if (!socket) {
            console.warn(`Socket for ${c.clientId} not found`);
            return;
          }
          socket.send(JSON.stringify(message));
        }
      };
      return { client, notifyOthersInRoom };
    }
  )
  .ws('/rooms/:roomId/socket', {
    body: t.Union([
      t.Object({
        type: t.Union([t.Literal('pause'), t.Literal('play')]),
      }),
      t.Object({
        type: t.Literal('rewind'),
        time: t.Number(),
      }),
      t.Object({
        type: t.Literal('play-speed'),
        speed: t.Number(),
      }),
    ]),
    message: async (ws, message) => {
      const { client } = ws.data;

      let response;
      switch (message.type) {
        case 'pause':
        case 'play': {
          response = { type: message.type };
          break;
        }
        case 'rewind': {
          response = {
            type: 'rewind',
            time: message.time,
          };
          break;
        }
        case 'play-speed': {
          response = {
            type: 'play-speed',
            speed: message.speed,
          };
          break;
        }
        default:
          throw new Error(`Unknown request message ${message}`);
      }
      ws.data.notifyOthersInRoom(response);
    },
    open: async (ws) => {
      const clientId = ws.data.headers['X-ClientId']!;
      ws.data.store.clientSockets.set(clientId, ws.raw);
    },
    close: (ws) => {
      const clientId = ws.data.headers['X-ClientId']!;
      ws.data.store.clientSockets.delete(clientId);
    },
  });

// export const socketRoutes: FastifyPluginAsync = async (fastify) => {
//   fastify.get(
//     '/rooms/:roomId/socket',
//     { websocket: true },
//     async (connection, req) => {
//       connection.socket.on('open', () => {
//         logger.info(`Socket for ${clientId} is opened`);
//       });

//       const { roomId } = req.params as { roomId: string };
//       const { clientId } = req.query as { clientId: string };
//       if (!clientId) {
//         throw new Error('Client ID not found in request headers');
//       }
//       if (Array.isArray(clientId)) {
//         throw new Error('Client ID is an array');
//       }
//       if (!(await clientExists(fastify.knex, clientId))) {
//         throw new Error('Client does not exist');
//       }
//       if (!(await roomExists(fastify.knex, roomId))) {
//         throw new Error('Room does not exist');
//       }
//       fastify.clientSockets[clientId] = connection.socket;
//       const client = await fastify.knex
//         .table<Client>('client')
//         .where({ clientId })
//         .first();
//       if (client?.roomId !== roomId) {
//         throw new Error('Client is not in the room');
//       }

//       const translateToOthers = async (response: SocketResponse) => {
//         const clients = await fastify.knex
//           .table<Client>('client')
//           .where({ roomId })
//           .and.whereNot({ clientId })
//           .select('clientId');

//         await Promise.all(
//           clients.map((client) => {
//             const socket = fastify.clientSockets[client.clientId];
//             if (!socket) {
//               logger.warn(`Socket for ${client.clientId} not found`);
//               return;
//             }
//             socket.send(JSON.stringify(response));
//           })
//         );
//       };

//       connection.socket.on('message', async (data) => {
//         const { type, payload } = JSON.parse(
//           data.toString('utf8')
//         ) as SocketRequest;

//         logger.info(`Received ${type} from ${clientId}`);

//         switch (type) {
//           case 'pause':
//           case 'play': {
//             const response: SocketResponse = {
//               type: type,
//             };
//             await translateToOthers(response);
//             break;
//           }
//           case 'rewind': {
//             const response: SocketResponse = {
//               type: 'rewind',
//               payload: { time: payload.time },
//             };
//             await translateToOthers(response);
//             break;
//           }
//           case 'play-speed': {
//             const response: SocketResponse = {
//               type: 'play-speed',
//               payload: { speed: payload.speed },
//             };
//             await translateToOthers(response);
//             break;
//           }
//           default:
//             throw new Error(`Unknown request type ${type}`);
//         }
//       });

//       connection.socket.on('close', () => {
//         logger.info(`Socket for ${clientId} is closed`);
//         delete fastify.clientSockets[clientId];
//       });
//     }
//   );
// };
