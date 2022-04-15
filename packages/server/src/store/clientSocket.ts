import { WebSocket } from 'ws';
import { ClientId } from '../types/clientId';

const clientSockets: Record<ClientId, WebSocket> = {};

export const saveSocket = (clientId: ClientId, socket: WebSocket): void => {
  clientSockets[clientId] = socket;
};

export const getSocket = (clientId: ClientId): WebSocket => {
  if (!clientSockets[clientId]) {
    throw new Error('Cannot find socket');
  }
  return clientSockets[clientId];
};

export const deleteSocket = (clientId: ClientId): void => {
  delete clientSockets[clientId];
};
