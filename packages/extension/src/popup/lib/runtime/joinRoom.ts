import { sendCommand } from '../../../messageStreams/command';

export const joinRoom = (roomId: string) => {
  sendCommand({ type: 'join-room', payload: { roomId } });
};
