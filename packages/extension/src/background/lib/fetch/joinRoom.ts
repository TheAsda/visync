import { JoinRoomRequest, Room } from 'visync-contracts';
import { getUrl } from '../../url';

export const joinRoom = async (
  roomId: string,
  clientId: string
): Promise<Room> => {
  const body: JoinRoomRequest = {
    clientId: clientId,
  };
  return fetch(getUrl(`/rooms/${roomId}/join`), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
};
