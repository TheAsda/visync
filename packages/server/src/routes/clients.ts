import { eq } from 'drizzle-orm';
import { Elysia, error, t } from 'elysia';
import db from '../store/db.js';
import { clients } from '../store/schema.js';

export const clientRoutes = new Elysia().group(
  '/clients/:clientId',
  {
    params: t.Object({
      clientId: t.String(),
    }),
  },
  (app) =>
    app
      .put(
        '/',
        async ({ params: { clientId } }) => {
          const client = await db.query.clients.findFirst({
            where: eq(clients.clientId, clientId),
          });
          if (client) {
            return error(400, 'Client already registered');
          }
          const createdClient = await db
            .insert(clients)
            .values({ clientId })
            .returning();
          return createdClient[0];
        },
        {
          params: t.Object({
            clientId: t.String(),
          }),
        }
      )
      .get(
        '/',
        async ({ params: { clientId } }) => {
          const client = await db.query.clients.findFirst({
            where: eq(clients.clientId, clientId),
          });
          if (!client) {
            return error(404, 'Client not found');
          }
          return client;
        },
        {
          params: t.Object({
            clientId: t.String(),
          }),
        }
      )
);
