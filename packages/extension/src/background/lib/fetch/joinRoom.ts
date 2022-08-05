import { JoinRoomRequest, Room } from 'visync-contracts';
import { fetcher } from '../../fetcher';

export const joinRoom = async (
  roomId: string,
  clientId: string
): Promise<Room> => {
  return fetcher
    .post(`/rooms/${roomId}/join`, {
      clientId: clientId,
    } as JoinRoomRequest)
    .then((res) => res.data);
};
