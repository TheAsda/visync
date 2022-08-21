import { sendCommand } from '../../../messageStreams/command';

export const leaveRoom = () => {
  sendCommand({ type: 'leave-room' });
};
