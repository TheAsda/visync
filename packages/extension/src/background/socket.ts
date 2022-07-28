import { SocketRequest, SocketResponse } from 'visync-contracts';
import { RuntimeResponse } from '../types/runtimeMessages';
import { getClientId } from './clientId';
import { serverUrl } from './fetcher';
import { sendResponseToTabs } from './utils/tabs';

export const address = serverUrl.replace('http', 'ws');

type TabSocket = {
  tabId: number;
  socket: WebSocket;
};

let tabSocket: TabSocket | undefined = undefined;

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

  socket.onmessage = async (e) => {
    const socketResponse = JSON.parse(e.data) as SocketResponse;

    let response: RuntimeResponse;

    switch (socketResponse.type) {
      case 'play':
      case 'pause':
        response = { type: socketResponse.type };
        break;
      case 'rewind':
        response = {
          type: 'rewind',
          payload: { time: socketResponse.payload.time },
        };
        break;
      case 'play-speed':
        response = {
          type: 'play-speed',
          payload: { speed: socketResponse.payload.speed },
        };
        break;
      case 'room':
        response = {
          type: 'status',
          payload: {
            clientId: await getClientId(),
            isSynced: true,
            room: {
              roomId: socketResponse.payload.roomId,
              clientsCount: socketResponse.payload.clientIds.length,
            },
          },
        };
        break;
    }

    chrome.runtime.sendMessage(JSON.stringify(response));
    sendResponseToTabs(response);
  };

  tabSocket = {
    tabId,
    socket,
  };

  return socket;
};

export const getTabSocket = (tabId: number): WebSocket => {
  if (!tabSocket) {
    throw new Error('Socket not initialized');
  }
  if (tabId !== tabSocket.tabId) {
    throw new Error('Socket is already opened for other tab');
  }
  return tabSocket.socket;
};

export const terminateTabSocket = (tabId: number) => {
  if (!tabSocket) {
    throw new Error('Socket not initialized');
  }
  if (tabId !== tabSocket.tabId) {
    throw new Error('Socket is already opened for other tab');
  }
  tabSocket.socket.close();
  tabSocket = undefined;
};

export const getTabId = () => {
  return tabSocket?.tabId;
};
