import { Room } from 'visync-contracts';
import { fetcher } from '../../fetcher';

export const getRoom = (roomId: string): Promise<Room> => {
  return fetcher.get(`/rooms/${roomId}`).then((res) => res.data);
};
