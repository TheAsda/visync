import { SocketRequest, SocketResponse } from 'syncboii-contracts';
import { ContentMessage } from '../types/runtimeMessages';
import { getClientId } from './clientId';
import { serverUrl } from './fetcher';

export const address = serverUrl.replace('http', 'ws');

const tabSockets: Record<number, WebSocket | undefined> = {};

export const initializeTab = (tabId: number) => {
  if (Object.keys(tabSockets).includes(tabId.toString())) {
    return;
  }
  tabSockets[tabId] = undefined;
};

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

  socket.onmessage = (e) => {
    const response = JSON.parse(e.data) as SocketResponse;

    const tabIds = getTabIds();

    let message: ContentMessage;

    switch (response.type) {
      case 'play':
      case 'pause':
        message = { type: response.type };
        break;
      case 'rewind':
        message = { type: 'rewind', payload: { time: response.payload.time } };
        break;
    }

    for (const tabId of tabIds) {
      chrome.tabs.sendMessage(tabId, JSON.stringify(message));
    }
  };

  if (tabSockets[tabId]) {
    tabSockets[tabId]!.close();
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
  socket.close();
  delete tabSockets[tabId];
};

export const getTabIds = (): number[] => Object.keys(tabSockets).map(Number);
