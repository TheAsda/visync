import { Room } from 'visync-contracts';
import { getUrl } from '../../url';
import { mapResponse } from '../mapResponse';

export const getRoom = (roomId: string): Promise<Room> => {
  return fetch(getUrl(`/rooms/${roomId}`)).then(mapResponse);
};
