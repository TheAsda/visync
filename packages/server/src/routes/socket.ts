import { ServerWebSocket } from 'bun';
import { eq } from 'drizzle-orm';
import { Elysia, error, Static, t } from 'elysia';
import db from '../store/db.js';
import { clients } from '../store/schema.js';

const event = t.Union([
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
]);
export type WebSocketEvent = Static<typeof event>;

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
    body: event,
    response: event,
    message: async (ws, message) => {
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
