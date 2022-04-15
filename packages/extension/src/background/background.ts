import { WebSocket } from 'ws';
import { logger } from '../logger';
import { RuntimeRequest } from '../types/runtimeMessages';
import { ensureClientId, getClientId } from './clientId';
import { fetcher } from './fetcher';
import {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
  Room,
  SocketRequest,
} from 'syncboii-contracts';
import {
  getTabSocket,
  initializeTabSocket,
  terminateTabSocket,
} from './socket';

chrome.runtime.onInstalled.addListener(() => {
  ensureClientId();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const request = JSON.parse(message) as RuntimeRequest;
  logger.debug('Got runtime message:', request);

  getClientId().then(async (clientId) => {
    switch (request.type) {
      case 'create-room': {
        const createRoomRequest: CreateRoomRequest = {
          clientId,
          link: request.payload.link,
        };

        const room = await fetcher<Room, CreateRoomRequest>(
          '/room/create',
          createRoomRequest
        );

        sendResponse(JSON.stringify(room));
        break;
      }
      case 'join-room': {
        const joinRoomRequest: JoinRoomRequest = {
          clientId,
          roomId: request.payload.roomId,
        };

        const room = await fetcher<Room, JoinRoomRequest>(
          '/room/create',
          joinRoomRequest
        );

        sendResponse(JSON.stringify(room));
        break;
      }
      case 'leave-room': {
        const leaveRoomRequest: LeaveRoomRequest = {
          clientId,
        };

        await fetcher<void, LeaveRoomRequest>('/room/create', leaveRoomRequest);

        sendResponse();
        break;
      }
      case 'get-room': {
        try {
          const room = await fetcher<Room>(`/client/${clientId}`);
          sendResponse(room);
        } catch (err) {
          sendResponse(null);
        }
        break;
      }
      case 'start-sync': {
        const tabId = ensureTabId(sender);
        initializeTabSocket(tabId);
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
      case 'stop-sync': {
        const tabId = ensureTabId(sender);
        terminateTabSocket(tabId);
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
