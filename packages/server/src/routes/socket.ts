import { ServerWebSocket } from 'bun';
import { eq } from 'drizzle-orm';
import { Elysia, error, Static, t } from 'elysia';
import db from '../store/db.js';
import { clients } from '../store/schema.js';

const videoState = t.Object({
  state: t.Union([t.Literal('playing'), t.Literal('paused')]),
  currentTime: t.Number(),
  playSpeed: t.Number(),
});

export type VideoState = Static<typeof videoState>;

const clientSockets = new Map<string, ServerWebSocket<unknown>>();

export const socketRoutes = new Elysia().ws('/clients/:clientId/socket', {
  body: t.Union([videoState, t.Literal('ping')]),
  response: videoState,
  params: t.Object({
    clientId: t.String(),
  }),
  message: async (ws, message) => {
    const clientId = ws.data.params.clientId;
    console.log(`ws message from ${clientId}:`, message);
    if (message === 'ping') {
      return;
    }

    const client = await db.query.clients.findFirst({
      where: eq(clients.clientId, clientId),
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
    // TODO: get current state from host
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
    const response: VideoState = message;
    notifyOthersInRoom(response);
  },
  open: async (ws) => {
    const clientId = ws.data.params.clientId;
    clientSockets.set(clientId, ws.raw);
  },
  close: (ws) => {
    const clientId = ws.data.params.clientId;
    clientSockets.delete(clientId);
  },
});
