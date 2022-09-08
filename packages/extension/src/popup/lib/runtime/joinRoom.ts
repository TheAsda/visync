import { sendCommand } from '../../../messageStreams/command';

export const joinRoom = (roomId: string) => {
  return sendCommand({ type: 'join-room', payload: { roomId } });
};
