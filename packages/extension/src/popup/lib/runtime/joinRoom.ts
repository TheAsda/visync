import { sendRoom } from '../../../messages/room';

export const joinRoom = (roomId: string) => {
  return sendRoom({ type: 'join-room', payload: { roomId } });
};
