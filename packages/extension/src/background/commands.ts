import { EdenWS } from '@elysiajs/eden/dist/treaty';
import { nanoid } from 'nanoid';
import { WebSocketEvent } from 'server/routes/socket';
import {
  handleVideoEvent,
  onVideoEventSubscribe,
} from '../content/commands/videoEvents';
import { handleClientId } from '../popup/commands/clientId';
import { handlePageVideos } from '../popup/commands/pageVideos';
import { handleRoomId } from '../popup/commands/roomId';
import { handleRoomInfo } from '../popup/commands/roomInfo';
import {
  handleCreateRoom,
  handleLeaveRoom,
} from '../popup/commands/roomOperations';
import { apiClient } from './apiClient';
import { getClientId } from './clientId';

handleClientId(async () => {
  const clientId = await getClientId();
  const res = await apiClient.clients({ clientId }).index.get();
  if (res.data !== null) {
    return clientId;
  }
  const res2 = await apiClient.clients({ clientId }).index.put({});
  if (res2.error !== null) {
    throw res2.error.value;
  }
  return clientId;
});

handleRoomId(async () => {
  const clientId = await getClientId();
  const res = await apiClient.clients({ clientId }).index.get();
  const roomId = res.data?.roomId ?? undefined;
  return roomId;
});

handleCreateRoom(async () => {
  const clientId = await getClientId();
  const roomId = nanoid(6);
  const res = await apiClient.rooms({ roomId }).index.put(
    {},
    {
      headers: {
        'x-clientid': clientId,
      },
    }
  );
  if (res.error !== null) {
    throw res.error.value;
  }
  return roomId;
});

handleRoomInfo(async (roomId) => {
  const clientId = await getClientId();
  const res = await apiClient.rooms({ roomId }).index.get({
    headers: {
      'x-clientid': clientId,
    },
  });
  if (res.error !== null) {
    throw res.error.value;
  }
  return {
    roomId: res.data.roomId,
    clients: res.data.clients.map((c) => c.clientId),
  };
});

handleLeaveRoom(async (roomId) => {
  const clientId = await getClientId();
  const res = await apiClient.rooms({ roomId }).leave.post(
    {},
    {
      headers: {
        'x-clientid': clientId,
      },
    }
  );
  if (res.error !== null) {
    throw res.error.value;
  }
});

handlePageVideos(async () => {
  return [];
});

let socket:
  | EdenWS<{
      body: WebSocketEvent;
    }>
  | undefined;

handleVideoEvent(async (event) => {
  switch (event.type) {
    case 'start-sync':
      if (socket) {
        throw new Error('Already syncing');
      }
      const clientId = await getClientId();
      const s = apiClient.clients({ clientId }).socket.subscribe();
      onVideoEventSubscribe((_, sendEvent) => {
        s.subscribe((message) => {
          switch (message.type) {
            case 'play':
            case 'pause':
              sendEvent({ type: message.type });
              break;
          }
        });
      });
      socket = s;
      break;
    case 'stop-sync':
      if (!socket) {
        throw new Error('Not syncing');
      }
      socket.close();
      socket = undefined;
      break;
    case 'play':
    case 'pause':
      if (!socket) {
        throw new Error('Not syncing');
      }
      socket.send({ type: event.type });
      break;
  }
});
