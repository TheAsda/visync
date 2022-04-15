import { SocketRequest } from 'syncboii-contracts';
import { WebSocket } from 'ws';
import { getClientId } from './clientId';
import { serverUrl } from './fetcher';

export const address = serverUrl.replace('http', 'ws');

const tabSockets: Record<number, WebSocket> = {};

export const initializeTabSocket = (tabId: number): WebSocket => {
  const socket = new WebSocket(address);

  socket.onopen = () => {
    getClientId().then((clientId) => {
      const socketRequest: SocketRequest = {
        type: 'register',
        payload: { clientId },
      };
      socket.send(JSON.stringify(socketRequest));
    });
  };

  if (tabSockets[tabId]) {
    tabSockets[tabId].terminate();
  }

  tabSockets[tabId] = socket;
  return socket;
};

export const getTabSocket = (tabId: number): WebSocket => {
  const socket = tabSockets[tabId];
  if (!socket) {
    throw new Error('Cannot find socket');
  }
  return socket;
};

export const terminateTabSocket = (tabId: number) => {
  const socket = tabSockets[tabId];
  if (!socket) {
    throw new Error('Cannot find socket');
  }
  socket.terminate();
  delete tabSockets[tabId];
};
