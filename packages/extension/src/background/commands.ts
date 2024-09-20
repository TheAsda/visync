import { nanoid } from 'nanoid';
import { handleClientId } from '../messageStreams/clientId';
import { handleRoomId } from '../messageStreams/roomId';
import { handleRoomInfo } from '../messageStreams/roomInfo';
import {
  handleCreateRoom,
  handleLeaveRoom,
} from '../messageStreams/roomOperations';
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
