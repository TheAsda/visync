import type { FastifyPluginAsync } from 'fastify';
import type { SocketRequest, SocketResponse } from 'syncboii-contracts';
import { logger } from '../logger';
import { getSocket, removeSocket, saveSocket } from '../store/clientSocket';
import { getRoomByClientId } from '../store/rooms';
import { retry } from '../utils/retry';

export const socketRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/*', { websocket: true }, (connection, req) => {
    connection.socket.on('message', async (data) => {
      const { type, payload } = JSON.parse(
        data.toString('utf8')
      ) as SocketRequest;
      logger.info(`Websocket request starting ${type}`);

      try {
        switch (type) {
          case 'register': {
            saveSocket(payload.clientId, connection.socket);
            break;
          }
          case 'pause':
          case 'play': {
            const response: SocketResponse = {
              type: type,
            };
            await translateToOthers(payload.clientId, response);
            break;
          }
          case 'rewind': {
            const response: SocketResponse = {
              type: 'rewind',
              payload: { time: payload.time },
            };
            await translateToOthers(payload.clientId, response);
            break;
          }
          case 'play-speed': {
            const response: SocketResponse = {
              type: 'play-speed',
              payload: { speed: payload.speed },
            };
            await translateToOthers(payload.clientId, response);
            break;
          }
          default:
            throw new Error(`Unknown request type ${type}`);
        }
      } catch (err) {
        if (err instanceof Error) {
          logger.error(err?.message);
        } else {
          logger.error(`Unknown error occurred: ${err}`);
        }
      }
      logger.info(`Websocket request finished ${type}`);
    });

    connection.socket.on('close', () => {
      removeSocket(connection.socket);
    });
  });
};

const translateToOthers = async (
  clientId: string,
  response: SocketResponse
) => {
  logger.debug(`Translating response from ${clientId} to others in room`);
  const room = getRoomByClientId(clientId);
  const otherClientIds = room.clientIds.filter((id) => id !== clientId);
  const message = JSON.stringify(response);
  const promises = [];
  for (const clientId of otherClientIds) {
    const sendResponse = () => {
      getSocket(clientId).send(message);
    };
    promises.push(retry(sendResponse));
  }
  return Promise.all(promises);
};
