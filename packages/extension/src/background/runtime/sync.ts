import { SocketRequest } from 'syncboii-contracts';
import { RuntimeResponse } from '../../types/runtimeMessages';
import {
  getTabSocket,
  initializeTabSocket,
  terminateTabSocket,
} from '../socket';
import { getClientStatus } from '../utils/status';
import { sendResponseToTabs } from '../utils/tabs';
import { RuntimeRequestHandler } from './runtimeRequestHandler';

export const handleSyncRuntimeRequest: RuntimeRequestHandler = async (
  clientId,
  request,
  sender,
  sendResponse
) => {
  switch (request.type) {
    case 'start-sync': {
      const tabId = ensureTabId(sender);
      const status = await getClientStatus(clientId);
      if (status.isSynced) {
        throw new Error('Already synced');
      }
      if (!status.room) {
        throw new Error('Client is not in room');
      }
      initializeTabSocket(tabId);
      const response: RuntimeResponse = {
        type: 'status',
        payload: {
          clientId,
          isSynced: true,
          room: {
            roomId: status.room.roomId,
            clientsCount: status.room?.clientIds.length,
          },
        },
      };
      sendResponse(JSON.stringify(response));
      break;
    }
    case 'play':
    case 'pause': {
      const tabId = ensureTabId(sender);
      const socket = getTabSocket(tabId);
      const socketRequest: SocketRequest = {
        type: request.type,
        payload: {
          clientId,
        },
      };
      socket.send(JSON.stringify(socketRequest));
      break;
    }
    case 'rewind': {
      const tabId = ensureTabId(sender);
      const socket = getTabSocket(tabId);
      const socketRequest: SocketRequest = {
        type: 'rewind',
        payload: {
          clientId,
          time: request.payload.time,
        },
      };
      socket.send(JSON.stringify(socketRequest));
      break;
    }
    case 'stop-sync': {
      const tabId = ensureTabId(sender);
      terminateTabSocket(tabId);
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

const ensureTabId = (sender: chrome.runtime.MessageSender): number => {
  if (!sender.tab?.id) {
    throw new Error('Sender is not tab');
  }
  return sender.tab.id;
};
