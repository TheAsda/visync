import type { WebSocket } from 'ws';
import { logger } from '../logger';

const meta = {
  store: 'client-socket',
};

const clientSockets: Record<string, WebSocket> = {};

export const saveSocket = (clientId: string, socket: WebSocket): void => {
  logger.debug(`Saving socket for ${clientId}`, { meta });
  clientSockets[clientId] = socket;
};

export const getSocket = (clientId: string): WebSocket => {
  logger.debug(`Getting socket for ${clientId}`, { meta });
  if (!clientSockets[clientId]) {
    throw new Error('Cannot find socket');
  }
  return clientSockets[clientId];
};

export const socketExists = async (clientId: string): Promise<boolean> => {
  logger.debug(`Checking for ${clientId} socket`, { meta });
  const socket = clientSockets[clientId];
  if (!socket) {
    logger.debug(`No socket for ${clientId}`, { meta });
    return false;
  }

  logger.debug('Pinging socket');
  const result = await Promise.race([
    new Promise<boolean>((res) => {
      socket.once('pong', () => {
        res(true);
      });
      socket.ping();
    }),
    new Promise<boolean>((res) => {
      setTimeout(() => res(false), 1000);
    }),
  ]);
  if (result === false) {
    logger.debug('Ping was not successful, removing websocket');
    socket.terminate();
    removeSocket(clientId);
  }
  return true;
};

export const removeSocket = (clientId: string): void => {
  logger.debug(`Removing socket for ${clientId}`, { meta });
  delete clientSockets[clientId];
};
