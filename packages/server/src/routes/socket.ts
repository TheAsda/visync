import type { FastifyPluginCallback } from 'fastify';
import type { SocketRequest, SocketResponse } from 'syncboii-contracts';
import { saveSocket, getSocket } from '../store/clientSocket';
import { getRoomByClientId } from '../store/rooms';

export const socketRoutes: FastifyPluginCallback = async (fastify) => {
  fastify.get('/*', { websocket: true }, (connection, req) => {
    connection.socket.on('message', (data) => {
      const { type, payload } = JSON.parse(
        data.toString('utf8')
      ) as SocketRequest;

      switch (type) {
        case 'register': {
          saveSocket(payload.clientId, connection.socket);
          break;
        }
        case 'pause':
        case 'play': {
          const room = getRoomByClientId(payload.clientId);
          const otherClientIds = room.clientIds.filter(
            (clientId) => clientId !== payload.clientId
          );
          const sockets = otherClientIds.map((clientId) => getSocket(clientId));
          const response: SocketResponse = {
            type: type,
          };
          for (const socket of sockets) {
            socket.send(JSON.stringify(response));
          }
          break;
        }
        case 'rewind': {
          const room = getRoomByClientId(payload.clientId);
          const otherClientIds = room.clientIds.filter(
            (clientId) => clientId !== payload.clientId
          );
          const sockets = otherClientIds.map((clientId) => getSocket(clientId));
          const response: SocketResponse = {
            type: 'rewind',
            payload: { time: payload.time },
          };
          for (const socket of sockets) {
            socket.send(JSON.stringify(response));
          }
          break;
        }
      }
    });
  });
};
