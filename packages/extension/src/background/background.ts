import { logger } from '../logger';
import { ContentMessage, RuntimeRequest } from '../types/runtimeMessages';
import { getClientId } from './clientId';
import { fetcher } from './fetcher';
import {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
  Room,
  SocketRequest,
} from 'syncboii-contracts';
import {
  getTabIds,
  getTabSocket,
  initializeTab,
  initializeTabSocket,
  terminateTabSocket,
} from './socket';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const request = JSON.parse(message) as RuntimeRequest;
  logger.debug('Got runtime message:', request);

  getClientId().then(async (clientId) => {
    switch (request.type) {
      case 'get-client': {
        let isInRoom = false;
        try {
          await fetcher<Room>(`/client/${clientId}`);
          isInRoom = true;
        } catch (err) {
          isInRoom = false;
        }

        const message: ContentMessage = {
          type: 'client',
          payload: {
            clientId,
            isInRoom,
          },
        };
        sendResponse(JSON.stringify(message));
        break;
      }
      case 'create-room': {
        const createRoomRequest: CreateRoomRequest = {
          clientId,
        };

        const room = await fetcher<Room, CreateRoomRequest>(
          '/room/create',
          createRoomRequest
        );

        const tabIds = getTabIds();

        const message: ContentMessage = {
          type: 'client',
          payload: {
            clientId,
            isInRoom: true,
          },
        };
        tabIds.forEach((tabId) => {
          chrome.tabs.sendMessage(tabId, JSON.stringify(message));
        });

        sendResponse(JSON.stringify(room));
        break;
      }
      case 'join-room': {
        const joinRoomRequest: JoinRoomRequest = {
          clientId,
          roomId: request.payload.roomId,
        };

        const room = await fetcher<Room, JoinRoomRequest>(
          '/room/join',
          joinRoomRequest
        );

        const tabIds = getTabIds();

        const message: ContentMessage = {
          type: 'client',
          payload: {
            clientId,
            isInRoom: true,
          },
        };
        tabIds.forEach((tabId) => {
          chrome.tabs.sendMessage(tabId, JSON.stringify(message));
        });

        sendResponse(JSON.stringify(room));
        break;
      }
      case 'leave-room': {
        const leaveRoomRequest: LeaveRoomRequest = {
          clientId,
        };

        await fetcher<void, LeaveRoomRequest>('/room/leave', leaveRoomRequest);

        const tabIds = getTabIds();

        const message: ContentMessage = {
          type: 'client',
          payload: {
            clientId,
            isInRoom: false,
          },
        };
        tabIds.forEach((tabId) => {
          chrome.tabs.sendMessage(tabId, JSON.stringify(message));
        });

        sendResponse();
        break;
      }
      case 'get-room': {
        try {
          const room = await fetcher<Room>(`/client/${clientId}`);
          sendResponse(JSON.stringify(room));
        } catch (err) {
          sendResponse(null);
        }
        break;
      }
      case 'start-sync': {
        const tabId = ensureTabId(sender);
        initializeTabSocket(tabId);
        sendResponse();
        break;
      }
      case 'play':
      case 'pause': {
        const tabId = ensureTabId(sender);
        let socket: WebSocket;
        try {
          socket = getTabSocket(tabId);
        } catch (err) {
          socket = initializeTabSocket(tabId);
        }
        const socketMessage: SocketRequest = {
          type: request.type,
          payload: {
            clientId,
          },
        };
        socket.send(JSON.stringify(socketMessage));
        break;
      }
      case 'rewind': {
        const tabId = ensureTabId(sender);
        let socket: WebSocket;
        try {
          socket = getTabSocket(tabId);
        } catch (err) {
          socket = initializeTabSocket(tabId);
        }
        const socketMessage: SocketRequest = {
          type: 'rewind',
          payload: {
            clientId,
            time: request.payload.time,
          },
        };
        socket.send(JSON.stringify(socketMessage));
        break;
      }
      case 'stop-sync': {
        const tabId = ensureTabId(sender);
        terminateTabSocket(tabId);
        sendResponse();
        break;
      }
      case 'ping': {
        const tabId = ensureTabId(sender);
        try {
          getTabSocket(tabId);
        } catch (err) {
          initializeTabSocket(tabId);
        }
        break;
      }
      case 'initialize': {
        const tabId = ensureTabId(sender);
        initializeTab(tabId);
        sendResponse();
        break;
      }
    }
  });

  return true;
});

const ensureTabId = (sender: chrome.runtime.MessageSender): number => {
  if (!sender.tab?.id) {
    throw new Error('Sender is not tab');
  }
  return sender.tab.id;
};
