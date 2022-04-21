import type { WebSocket } from 'ws';
import type { ClientId } from 'syncboii-contracts';
import { logger } from '../logger';

const meta = {
  store: 'client-socket',
};

const clientSockets: Record<ClientId, WebSocket> = {};

export const saveSocket = (clientId: ClientId, socket: WebSocket): void => {
  logger.debug(`Saving socket for ${clientId}`, { meta });
  clientSockets[clientId] = socket;
};

export const getSocket = (clientId: ClientId): WebSocket => {
  logger.debug(`Getting socket for ${clientId}`, { meta });
  if (!clientSockets[clientId]) {
    throw new Error('Cannot find socket');
  }
  return clientSockets[clientId];
};

export const removeSocket = (clientId: ClientId): void => {
  logger.debug(`Removing socket for ${clientId}`, { meta });
  delete clientSockets[clientId];
};
