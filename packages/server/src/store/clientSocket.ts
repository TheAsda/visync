import type { WebSocket } from 'ws';
import { logger as defaultLogger } from '../logger.js';

const logger = defaultLogger.child({
  store: 'client-socket',
});

const clientSockets: Record<string, WebSocket> = {};

export const saveSocket = (clientId: string, socket: WebSocket): void => {
  logger.debug(`Saving socket for ${clientId}`);
  if (clientSockets[clientId] !== undefined) {
    logger.warn(
      `Socket has already been registered for ${clientId}, closing old socket`
    );
    clientSockets[clientId].close();
  }
  clientSockets[clientId] = socket;
};

export const getSocket = (clientId: string): WebSocket => {
  logger.debug(`Getting socket for ${clientId}`);
  if (!clientSockets[clientId]) {
    throw new Error('Cannot find socket');
  }
  return clientSockets[clientId];
};

export const socketExists = async (clientId: string): Promise<boolean> => {
  logger.debug(`Checking for ${clientId} socket`);
  const socket = clientSockets[clientId];
  if (!socket) {
    logger.debug(`No socket for ${clientId}`);
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
    removeSocketByClientId(clientId);
  }
  return true;
};

export const removeSocketByClientId = (clientId: string): void => {
  logger.debug(`Removing socket for ${clientId}`);
  if (clientSockets[clientId].readyState !== 3) {
    clientSockets[clientId].close();
  }
  delete clientSockets[clientId];
};

export const removeSocket = (socket: WebSocket): void => {
  logger.debug(`Removing socket`);
  const clientIndex = Object.values(clientSockets).findIndex(
    (s) => s === socket
  );
  const clientId = Object.keys(clientSockets)[clientIndex];
  if (!clientId) {
    logger.warn('Cannot find record for socket');
    return;
  }
  if (clientSockets[clientId].readyState !== 3) {
    clientSockets[clientId].close();
  }
  delete clientSockets[clientId];
  logger.debug(`Removed socket for ${clientId}`);
};
