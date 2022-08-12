import { filter } from 'rxjs';
import { clientStream } from '../messages/client';
import { pingStream } from '../messages/ping';
import { roomStream } from '../messages/room';
import { settingsStream } from '../messages/settings';
import { syncStream } from '../messages/sync';
import { Client } from '../types/client';
import './contextMenu';
import { getRoom } from './lib/fetch/getRoom';
import { isServerError } from './lib/isAxiosError';
import { clientStore } from './store/client';
import { settingsStore } from './store/settings';
import { startSyncing, stopSyncing } from './sync';

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
      const room = await getRoom(clientStore.roomId);
      sendResponse({
        roomId: room.roomId,
        link: room.link,
        clientIds: room.clientIds,
      });
    } else {
      sendResponse(null);
    }
    return;
  }
  switch (request.type) {
    case 'create-room': {
      try {
        const room = await clientStore.createRoom();
        sendResponse({
          roomId: room.roomId,
          link: room.link,
          clientIds: room.clientIds,
        });
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
        const room = await clientStore.joinRoom(request.payload.roomId);
        sendResponse({
          roomId: room.roomId,
          link: room.link,
          clientIds: room.clientIds,
        });
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

pingStream.subscribe(async () => {
  console.debug('Got ping');
});

syncStream
  .pipe(
    filter(
      (request) =>
        request[0].type === 'start-sync' || request[0].type === 'stop-sync'
    )
  )
  .subscribe(([request, sender]) => {
    if (!sender.tab?.id) {
      console.warn('Sender is not a tab');
      return;
    }
    switch (request.type) {
      case 'start-sync': {
        startSyncing(sender.tab.id, request.payload.videoSelector);
        break;
      }
      case 'stop-sync': {
        stopSyncing();
        break;
      }
    }
  });
