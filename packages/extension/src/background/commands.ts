import {
  handleStartSync,
  handleStopSync,
} from '../content/commands/videoState';
import { generateRandomId } from '../lib/randomId';
import { handleClientId } from '../popup/commands/clientId';
import { handleRoomId } from '../popup/commands/roomId';
import { handleRoomInfo } from '../popup/commands/roomInfo';
import {
  handleCreateRoom,
  handleJoinRoom,
  handleLeaveRoom,
} from '../popup/commands/roomOperations';
import { apiClient } from './apiClient';
import { getClientId } from './clientId';
import { startSyncing } from './syncer';

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
  const roomId = generateRandomId();
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

handleJoinRoom(async (roomId) => {
  const clientId = await getClientId();
  const res = await apiClient.rooms({ roomId }).join.post(
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

let destroy: (() => void) | undefined;

handleStartSync(async (_, sender) => {
  const tabId = sender.tab?.id;
  if (!tabId) {
    throw new Error('No tab id found');
  }
  destroy = await startSyncing(tabId);
});

handleStopSync(async (_, sender) => {
  if (!destroy) {
    throw new Error('Not synced');
  }
  destroy();
  destroy = undefined;
});
