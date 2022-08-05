import {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
  Room,
} from 'visync-contracts';
import { RuntimeResponse } from '../../types/runtimeMessages';
import { fetcher } from '../fetcher';
import { clientStore } from '../store/client';
import { sendResponseToTabs } from '../utils/tabs';
import { RuntimeRequestHandler } from './runtimeRequestHandler';

export const roomRequestHandler: RuntimeRequestHandler = async (
  request,
  sender,
  sendResponse
) => {
  switch (request.type) {
    case 'create-room': {
      const roomId = await clientStore.createRoom();
      const response: RuntimeResponse = {
        type: 'client',
        payload: {
          roomId,
          clientId: clientStore.clientId,
        },
      };
      sendResponseToTabs(response);
      const message = JSON.stringify(response);
      sendResponse(message);
      break;
    }
    case 'join-room': {
      const roomId = await clientStore.joinRoom(request.payload.roomId);
      const response: RuntimeResponse = {
        type: 'client',
        payload: {
          roomId,
          clientId: clientStore.clientId,
        },
      };
      sendResponseToTabs(response);
      const message = JSON.stringify(response);
      sendResponse(message);
      break;
    }
    case 'leave-room': {
      await clientStore.leaveRoom();
      const response: RuntimeResponse = {
        type: 'client',
        payload: {
          roomId: undefined,
          clientId: clientStore.clientId,
        },
      };
      sendResponseToTabs(response);
      const message = JSON.stringify(response);
      sendResponse(message);
      break;
    }
  }
};
