import type { FastifyPluginAsync } from 'fastify';
import type {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
} from 'visync-contracts';
import { Client, Room } from '../store/knex.js';
import { roomExists } from '../store/utils/room.js';
import {
  ensureClientIdFromBody,
  ensureRoomIdFromParams,
} from './utils/ensure.js';

export const roomsRoutes: FastifyPluginAsync = async (fastify) => {
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
        .where('roomId', roomId)
        .first();

      reply.status(201).send(room);
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

      const r = await fastify.knex
        .table<Room>('room')
        .where('room.roomId', roomId)
        .join('client', 'room.roomId', '=', 'client.roomId')
        .select('room.roomId', 'room.link', 'client.clientId');
      reply.send(r);
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

      reply.status(204).send();
      // await translateToOthersInRoom(room, body.clientId, response);
    }
  );
};

// const translateToOthersInRoom = async (
//   room: Room,
//   clientId: string,
//   response: SocketResponse
// ) => {
//   logger.debug(`Translating response from ${clientId} to others in room`);
//   const otherClientIds = room.clientIds.filter((id) => id !== clientId);
//   const message = JSON.stringify(response);
//   const promises = [];
//   for (const clientId of otherClientIds) {
//     const sendResponse = () => {
//       getSocket(clientId).send(message);
//     };
//     promises.push(retry(sendResponse));
//   }
//   return Promise.all(promises);
// };
