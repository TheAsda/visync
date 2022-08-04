import fp from 'fastify-plugin';
import Knex from 'knex';

const knex = Knex.default({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: ':memory:',
  },
});

export type Room = {
  roomId: string;
  link: string | null;
};
await knex.schema.createTable('room', (table) => {
  table.string('roomId').primary();
  table.string('link').nullable();
});

export type Client = {
  clientId: string;
  roomId: string | null;
};
await knex.schema.createTable('client', (table) => {
  table.string('clientId').primary();
  table.string('roomId').nullable().references('rooms.roomId');
});

export const knexPlugin = fp.default(async (fastify) => {
  fastify.decorate('knex', knex);

  fastify.addHook('onClose', (fastify, done) => {
    if (fastify.knex === knex) {
      fastify.knex.destroy(done);
    }
  });
});
declare module 'fastify' {
  interface FastifyInstance {
    knex: typeof knex;
  }
}

export { knex };
