import { SocketRequest } from 'visync-contracts';
import { RuntimeResponse } from '../../types/runtimeMessages';
import { getClientId } from '../clientId';
import {
  getTabId,
  getTabSocket,
  initializeTabSocket,
  terminateTabSocket,
} from '../socket';
import { clientStore } from '../store/client';
import { sendResponseToTabs } from '../utils/tabs';
import { RuntimeRequestHandler } from './runtimeRequestHandler';

export const syncRequestHandler: RuntimeRequestHandler = async (
  request,
  sender,
  sendResponse
) => {
  switch (request.type) {
    case 'start-sync': {
      const tabId = getTabIdFromSender(sender);
      const status = await getClientStatus(clientStore.clientId);
      if (status.isSynced) {
        throw new Error('Already synced');
      }
      if (!status.room) {
        throw new Error('Client is not in room');
      }
      initializeTabSocket(tabId);
      startListeningForTabClose();
      sendResponseToTabs(response);
      sendResponse(JSON.stringify(response));
      break;
    }
    case 'play':
    case 'pause': {
      const tabId = getTabIdFromSender(sender);
      const socket = getTabSocket(tabId);
      const socketRequest: SocketRequest = {
        type: request.type,
        payload: {
          clientId,
        },
      };
      socket.send(JSON.stringify(socketRequest));
      sendResponse();
      break;
    }
    case 'rewind': {
      const tabId = getTabIdFromSender(sender);
      const socket = getTabSocket(tabId);
      const socketRequest: SocketRequest = {
        type: 'rewind',
        payload: {
          clientId,
          time: request.payload.time,
        },
      };
      socket.send(JSON.stringify(socketRequest));
      sendResponse();
      break;
    }
    case 'play-speed': {
      const tabId = getTabIdFromSender(sender);
      const socket = getTabSocket(tabId);
      const socketRequest: SocketRequest = {
        type: 'play-speed',
        payload: {
          clientId,
          speed: request.payload.speed,
        },
      };
      socket.send(JSON.stringify(socketRequest));
      sendResponse();
      break;
    }
    case 'stop-sync': {
      const tabId = getTabIdFromSender(sender);
      terminateTabSocket(tabId);
      stopListeningForTabClose();
      const status = await getClientStatus(clientId);
      if (!status.room) {
        throw new Error('Client is not in room');
      }
      const response: RuntimeResponse = {
        type: 'status',
        payload: {
          clientId,
          isSynced: false,
          room: {
            roomId: status.room.roomId,
            clientsCount: status.room?.clientIds.length,
          },
        },
      };
      sendResponseToTabs(response);
      sendResponse(JSON.stringify(response));
      break;
    }
  }
};

const getTabIdFromSender = (sender: chrome.runtime.MessageSender): number => {
  if (!sender.tab?.id) {
    throw new Error('Sender is not tab');
  }
  return sender.tab.id;
};

const handleTabClose = async (tabId: number) => {
  if (tabId !== getTabId()) {
    return;
  }

  terminateTabSocket(tabId);
  const clientId = await getClientId();
  const status = await getClientStatus(clientId);
  if (!status.room) {
    throw new Error('Client is not in room');
  }
  const response: RuntimeResponse = {
    type: 'status',
    payload: {
      clientId,
      isSynced: false,
      room: {
        roomId: status.room.roomId,
        clientsCount: status.room?.clientIds.length,
      },
    },
  };
  sendResponseToTabs(response);
  stopListeningForTabClose();
};

const handleTabRefresh = (tabId: number, info: chrome.tabs.TabChangeInfo) => {
  if (info.status === 'loading') {
    handleTabClose(tabId);
  }
};

const startListeningForTabClose = () => {
  chrome.tabs.onRemoved.addListener(handleTabClose);
  chrome.tabs.onUpdated.addListener(handleTabRefresh);
};

const stopListeningForTabClose = () => {
  chrome.tabs.onRemoved.removeListener(handleTabClose);
  chrome.tabs.onUpdated.removeListener(handleTabRefresh);
};
