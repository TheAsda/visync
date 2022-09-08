import { sendCommand } from '../../../messageStreams/command';

export const leaveRoom = () => {
  return sendCommand({ type: 'leave-room' });
};
