import type { FastifyPluginAsync } from 'fastify';
import type {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
} from 'visync-contracts';
import { logger } from '../logger.js';
import { Client, Room } from '../store/knex.js';
import { roomExists } from '../store/utils/room.js';
import {
  ensureClientIdFromBody,
  ensureRoomIdFromParams,
} from './utils/ensure.js';
import { mapRoom } from './utils/map.js';

export const roomsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/rooms/:roomId',
    { preHandler: ensureRoomIdFromParams },
    async (request, reply) => {
      const { roomId } = request.params as { roomId: string };

      const room = await fastify.knex
        .table<Room>('room')
        .where('room.roomId', roomId)
        .leftJoin('client', 'room.roomId', 'client.roomId')
        .select<
          (Room & Pick<Client, 'clientId'>)[]
        >('room.*', 'client.clientId');

      reply.send(mapRoom(room));
    }
  );

  fastify.put(
    '/rooms/:roomId',
    { preHandler: ensureClientIdFromBody },
    async (request, reply) => {
      const { roomId } = request.params as { roomId: string };
      const body = request.body as CreateRoomRequest;

      if (await roomExists(fastify.knex, roomId)) {
        reply.code(400).send({
          error: `Room ${roomId} already exists`,
        });
        return;
      }

      try {
        await fastify.knex.transaction(async (trx) => {
          await trx.table<Room>('room').insert({
            roomId,
            link: body.link,
          });
          await trx
            .table<Client>('client')
            .update({
              roomId,
            })
            .where('clientId', body.clientId);
        });
      } catch (e) {
        reply.code(500).send({
          error: `Failed to create room ${roomId}`,
        });
        return;
      }

      const room = await fastify.knex
        .table<Room>('room')
        .where('room.roomId', roomId)
        .leftJoin('client', 'room.roomId', 'client.roomId')
        .select<
          (Room & Pick<Client, 'clientId'>)[]
        >('room.*', 'client.clientId');

      reply.status(201).send(mapRoom(room));
    }
  );

  fastify.post(
    '/rooms/:roomId/join',
    { preHandler: [ensureRoomIdFromParams, ensureClientIdFromBody] },
    async (request, reply) => {
      const { roomId } = request.params as { roomId: string };
      const body = request.body as JoinRoomRequest;

      const client = await fastify.knex
        .table<Client>('client')
        .where('clientId', body.clientId)
        .first();

      if (client?.roomId === roomId) {
        reply.code(400).send({
          error: `Client ${body.clientId} already in room ${roomId}`,
        });
        return;
      }
      if (client?.roomId !== null) {
        reply.code(400).send({
          error: `Client ${body.clientId} already in room ${client?.roomId}`,
        });
        return;
      }

      try {
        await fastify.knex
          .table<Client>('client')
          .update({ roomId })
          .where('clientId', body.clientId);
      } catch (e) {
        reply.code(500).send({
          error: `Failed to join room ${roomId}`,
        });
        return;
      }

      const room = await fastify.knex
        .table<Room>('room')
        .where('room.roomId', roomId)
        .leftJoin('client', 'room.roomId', 'client.roomId')
        .select<
          (Room & Pick<Client, 'clientId'>)[]
        >('room.*', 'client.clientId');

      reply.send(mapRoom(room));
    }
  );

  fastify.post(
    '/rooms/:roomId/leave',
    { preHandler: [ensureRoomIdFromParams, ensureClientIdFromBody] },
    async (request, reply) => {
      const { roomId } = request.params as { roomId: string };
      const body = request.body as LeaveRoomRequest;

      const client = await fastify.knex
        .table<Client>('client')
        .where({
          clientId: body.clientId,
        })
        .first();
      if (client?.roomId !== roomId) {
        reply.code(400).send({
          error: `Client ${body.clientId} is not in room ${roomId}`,
        });
        return;
      }

      await fastify.knex
        .table<Client>('client')
        .where('clientId', body.clientId)
        .update({ roomId: null });

      const count = await fastify.knex
        .table<Client>('client')
        .where('roomId', roomId)
        .count<{ count: number }>('clientId', { as: 'count' })
        .first()
        .then((r) => r?.count ?? 0);

      if (count === 0) {
        logger.info(`Room ${roomId} is empty, deleting`);
        await fastify.knex.table<Room>('room').where('roomId', roomId).del();
      }

      reply.status(204).send();
    }
  );
};
