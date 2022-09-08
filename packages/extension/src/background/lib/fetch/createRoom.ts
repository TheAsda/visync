import { CreateRoomRequest, Room } from 'visync-contracts';
import { getUrl } from '../../url';
import { mapResponse } from '../mapResponse';

export const createRoom = async (
  roomId: string,
  clientId: string
): Promise<Room> => {
  const body: CreateRoomRequest = {
    clientId: clientId,
  };
  return fetch(getUrl(`/rooms/${roomId}`), {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(mapResponse);
};
