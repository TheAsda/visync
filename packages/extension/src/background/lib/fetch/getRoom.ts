import { Room } from 'visync-contracts';
import { getUrl } from '../../url';

export const getRoom = (roomId: string): Promise<Room> => {
  return fetch(getUrl(`/rooms/${roomId}`)).then((res) => res.json());
};
