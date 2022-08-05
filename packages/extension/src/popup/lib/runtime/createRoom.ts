import { sendRoom } from '../../../messages/room';

export const createRoom = () => {
  return sendRoom({ type: 'create-room' });
};
