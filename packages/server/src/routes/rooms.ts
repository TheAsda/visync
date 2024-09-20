import { eq } from 'drizzle-orm';
import { Elysia, error, t } from 'elysia';
import db from '../store/db.js';
import { clients, rooms } from '../store/schema.js';

export const roomsRoutes = new Elysia().group(
  '/rooms/:roomId',
  {
    params: t.Object({
      roomId: t.String(),
    }),
    headers: t.Object({
      'x-clientid': t.String(),
    }),
  },
  (app) =>
    app
      .put(
        '/',
        async ({
          params: { roomId },
          body: { link },
          headers: { 'x-clientid': clientId },
        }) => {
          const room = await db.query.rooms.findFirst({
            where: eq(rooms.roomId, roomId),
          });
          if (room) {
            return error(400, 'Room already exists');
          }
          const client = await db.query.clients.findFirst({
            where: eq(clients.clientId, clientId),
          });
          if (!client) {
            return error(400, 'Client not found');
          }
          if (client.roomId) {
            return error(400, 'Client already in a room');
          }
          const createdRoom = await db.transaction(async (tx) => {
            await tx
              .insert(rooms)
              .values({ roomId: roomId, link: link })
              .returning();
            await tx
              .update(clients)
              .set({ roomId: roomId })
              .where(eq(clients.clientId, clientId));
            return await tx.query.rooms.findFirst({
              where: eq(rooms.roomId, roomId),
              with: {
                clients: true,
              },
            });
          });
          if (!createdRoom) {
            return error(500, 'Failed to create room');
          }
          return createdRoom;
        },
        {
          body: t.Object({
            link: t.Optional(t.String()),
          }),
        }
      )
      .get(
        '/',
        async ({ params: { roomId }, headers: { 'x-clientid': clientId } }) => {
          const room = await db.query.rooms.findFirst({
            where: eq(rooms.roomId, roomId),
            with: {
              clients: true,
            },
          });
          if (!room) {
            return error(404, 'Room not found');
          }
          if (!room.clients.find((c) => c.clientId === clientId)) {
            return error(400, 'Client not in the room');
          }
          return room;
        }
      )
      .post(
        '/join',
        async ({ params: { roomId }, headers: { 'x-clientid': clientId } }) => {
          const room = await db.query.rooms.findFirst({
            where: eq(rooms.roomId, roomId),
          });
          if (!room) {
            return error(404, 'Room not found');
          }
          const client = await db.query.clients.findFirst({
            where: eq(clients.clientId, clientId),
          });
          if (!client) {
            return error(404, 'Client not found');
          }
          if (client.roomId) {
            return error(400, 'Client already in a room');
          }
          await db
            .update(clients)
            .set({ roomId: roomId })
            .where(eq(clients.clientId, clientId));
          return await db.query.rooms.findFirst({
            where: eq(rooms.roomId, roomId),
          });
        }
      )
      .post(
        '/leave',
        async ({
          params: { roomId },
          headers: { 'x-clientid': clientId },
          set,
        }) => {
          const room = await db.query.rooms.findFirst({
            where: eq(rooms.roomId, roomId),
            with: { clients: true },
          });
          if (!room) {
            return error(404, 'Room not found');
          }
          const client = await db.query.clients.findFirst({
            where: eq(clients.clientId, clientId),
          });
          if (!client) {
            return error(404, 'Client not found');
          }
          if (!client.roomId) {
            return error(400, 'Client not in a room');
          }
          await db
            .update(clients)
            .set({ roomId: null })
            .where(eq(clients.clientId, clientId));
          if (room.clients.length === 1) {
            await db.delete(rooms).where(eq(rooms.roomId, roomId));
          }
          set.status = 204;
        }
      )
);
