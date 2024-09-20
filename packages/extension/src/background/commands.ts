import { nanoid } from 'nanoid';
import { handleClientId } from '../messageStreams/clientId';
import { handleRoomId } from '../messageStreams/roomId';
import { handleCreateRoom } from '../messageStreams/roomOperations';
import { apiClient } from './apiClient';
import { getClientId } from './clientId';

handleClientId(getClientId);
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
        'X-ClientId': clientId,
      },
    }
  );
  if (res.error !== null) {
    throw res.error.value;
  }
  return roomId;
});
