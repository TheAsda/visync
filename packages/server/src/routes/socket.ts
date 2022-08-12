import FastifyWebSocket from '@fastify/websocket';
import type { FastifyPluginAsync } from 'fastify';
import type { SocketRequest, SocketResponse } from 'visync-contracts';
import { logger } from '../logger.js';
import { clientSocketPlugin } from '../store/clientSocket.js';
import { Client } from '../store/knex.js';
import { clientExists } from '../store/utils/client.js';
import { roomExists } from '../store/utils/room.js';

export const socketRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(clientSocketPlugin);
  await fastify.register(FastifyWebSocket.default);
  fastify.get(
    '/rooms/:roomId/socket',
    { websocket: true },
    async (connection, req) => {
      connection.socket.on('open', () => {
        logger.info(`Socket for ${clientId} is opened`);
      });

      const { roomId } = req.params as { roomId: string };
      const { clientId } = req.query as { clientId: string };
      if (!clientId) {
        throw new Error('Client ID not found in request headers');
      }
      if (Array.isArray(clientId)) {
        throw new Error('Client ID is an array');
      }
      if (!(await clientExists(fastify.knex, clientId))) {
        throw new Error('Client does not exist');
      }
      if (!(await roomExists(fastify.knex, roomId))) {
        throw new Error('Room does not exist');
      }
      fastify.clientSockets[clientId] = connection.socket;
      const client = await fastify.knex
        .table<Client>('client')
        .where({ clientId })
        .first();
      if (client?.roomId !== roomId) {
        throw new Error('Client is not in the room');
      }

      const translateToOthers = async (response: SocketResponse) => {
        const clients = await fastify.knex
          .table<Client>('client')
          .where({ roomId })
          .and.whereNot({ clientId })
          .select('clientId');

        await Promise.all(
          clients.map((client) => {
            const socket = fastify.clientSockets[client.clientId];
            if (!socket) {
              throw new Error(`Socket for ${client.clientId} not found`);
            }
            socket.send(JSON.stringify(response));
          })
        );
      };

      connection.socket.on('message', async (data) => {
        const { type, payload } = JSON.parse(
          data.toString('utf8')
        ) as SocketRequest;

        logger.info(`Received ${type} from ${clientId}`);

        switch (type) {
          case 'pause':
          case 'play': {
            const response: SocketResponse = {
              type: type,
            };
            await translateToOthers(response);
            break;
          }
          case 'rewind': {
            const response: SocketResponse = {
              type: 'rewind',
              payload: { time: payload.time },
            };
            await translateToOthers(response);
            break;
          }
          case 'play-speed': {
            const response: SocketResponse = {
              type: 'play-speed',
              payload: { speed: payload.speed },
            };
            await translateToOthers(response);
            break;
          }
          default:
            throw new Error(`Unknown request type ${type}`);
        }
      });

      connection.socket.on('close', () => {
        logger.info(`Socket for ${clientId} is closed`);
        delete fastify.clientSockets[clientId];
      });
    }
  );
};
