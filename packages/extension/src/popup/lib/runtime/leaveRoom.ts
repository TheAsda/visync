import { sendMessage } from './sendMessage';

export const leaveRoom = () =>
  sendMessage({ type: 'leave-room' }).then((res) => {
    if (res.type !== 'status') {
      throw new Error('Unexpected response type');
    }
    return res.payload;
  });
