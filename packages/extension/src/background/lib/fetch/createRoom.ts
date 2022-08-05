import { CreateRoomRequest, Room } from 'visync-contracts';
import { fetcher } from '../../fetcher';

export const createRoom = async (
  roomId: string,
  clientId: string
): Promise<Room> => {
  return fetcher
    .put(`/rooms/${roomId}`, {
      clientId: clientId,
    } as CreateRoomRequest)
    .then((res) => res.data);
};
