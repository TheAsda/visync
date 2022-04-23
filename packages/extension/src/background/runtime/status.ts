import { RuntimeResponse } from '../../types/runtimeMessages';
import { getClientStatus } from '../utils/status';
import { RuntimeRequestHandler } from './runtimeRequestHandler';

export const statusRequestHandler: RuntimeRequestHandler = async (
  clientId,
  request,
  sender,
  sendResponse
) => {
  if (request.type !== 'status') {
    return;
  }
  const status = await getClientStatus(clientId);
    
  const response: RuntimeResponse = {
    type: 'status',
    payload: {
      clientId,
      isSynced: status.isSynced,
      room: status.room
        ? {
            roomId: status.room.roomId,
            clientsCount: status.room.clientIds.length,
          }
        : undefined,
    },
  };
  const message = JSON.stringify(response);
  chrome.runtime.sendMessage(message);
  sendResponse(message);
};
