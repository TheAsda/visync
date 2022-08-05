import { sendRoom } from '../../../messages/room';

export const leaveRoom = () => {
  return sendRoom({ type: 'leave-room' });
};
