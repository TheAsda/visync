import { clientStream } from '../messages/client';
import { roomStream } from '../messages/room';
import { settingsStream } from '../messages/settings';
import { Client } from '../types/client';
import { clientStore } from './store/client';
import { settingsStore } from './store/settings';
import { isServerError } from './utils/isAxiosError';

clientStream.subscribe(([, sender, sendResponse]) => {
  const client: Client = {
    clientId: clientStore.clientId,
    roomId: clientStore.roomId,
    isSynced: false,
  };
  sendResponse(client);
});

roomStream.subscribe(async ([request, sender, sendResponse]) => {
  if (!request) {
    if (clientStore.roomId) {
      sendResponse({
        roomId: clientStore.roomId,
      });
    } else {
      sendResponse(null);
    }
    return;
  }
  switch (request.type) {
    case 'create-room': {
      try {
        const roomId = await clientStore.createRoom();
        sendResponse({ roomId });
      } catch (error) {
        let message;
        if (isServerError(error)) {
          message = error.response?.data.error;
        }
        message ??= 'Failed to create room';
        sendResponse({ message });
      }
      break;
    }
    case 'join-room': {
      try {
        const roomId = await clientStore.joinRoom(request.payload.roomId);
        sendResponse({ roomId });
      } catch (error) {
        let message;
        if (isServerError(error)) {
          message = error.response?.data.error;
        }
        message ??= 'Failed to join room';
        sendResponse({ message });
      }
      break;
    }
    case 'leave-room': {
      try {
        await clientStore.leaveRoom();
        sendResponse(null);
      } catch (error) {
        let message;
        if (isServerError(error)) {
          message = error.response?.data.error;
        }
        message ??= 'Failed to leave room';
        sendResponse({ message });
      }
      break;
    }
  }
});

settingsStream.subscribe(async ([request, sender, sendResponse]) => {
  if (!request) {
    sendResponse(settingsStore.settings);
    return;
  }
  switch (request.type) {
    case 'save-settings': {
      const settings = await settingsStore.saveSettings(request.payload);
      sendResponse(settings);
    }
  }
});
