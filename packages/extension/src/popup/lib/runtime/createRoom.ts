import { sendCommand } from '../../../messageStreams/command';

export const createRoom = () => {
  sendCommand({ type: 'create-room' });
};
