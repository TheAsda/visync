import { sendCommand } from '../../../messageStreams/command';

export const createRoom = () => {
  return sendCommand({ type: 'create-room' });
};
