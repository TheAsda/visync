import {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
  Room,
} from 'syncboii-contracts';
import { RuntimeResponse } from '../../types/runtimeMessages';
import { fetcher } from '../fetcher';
import { sendResponseToTabs } from '../utils/tabs';
import { RuntimeRequestHandler } from './runtimeRequestHandler';

export const roomRequestHandler: RuntimeRequestHandler = async (
  clientId,
  request,
  sender,
  sendResponse
) => {
  switch (request.type) {
    case 'create-room': {
      const createRoomRequest: CreateRoomRequest = {
        clientId,
      };
      const room = await fetcher<Room, CreateRoomRequest>(
        '/room/create',
        createRoomRequest
      );
      const response: RuntimeResponse = {
        type: 'status',
        payload: {
          clientId,
          room: {
            roomId: room.roomId,
            clientsCount: room.clientIds.length,
          },
          isSynced: false,
        },
      };
      sendResponseToTabs(response);
      const message = JSON.stringify(response);
      sendResponse(message);
      chrome.runtime.sendMessage(message);
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
      const response: RuntimeResponse = {
        type: 'status',
        payload: {
          clientId,
          room: {
            roomId: room.roomId,
            clientsCount: room.clientIds.length,
          },
          isSynced: false,
        },
      };
      sendResponseToTabs(response);
      const message = JSON.stringify(response);
      sendResponse(message);
      chrome.runtime.sendMessage(message);
      break;
    }
    case 'leave-room': {
      const leaveRoomRequest: LeaveRoomRequest = {
        clientId,
      };
      await fetcher<void, LeaveRoomRequest>('/room/leave', leaveRoomRequest);
      const response: RuntimeResponse = {
        type: 'status',
        payload: {
          clientId,
          isSynced: false,
        },
      };
      sendResponseToTabs(response);
      const message = JSON.stringify(response);
      sendResponse(message);
      chrome.runtime.sendMessage(message);
      break;
    }
  }
};
