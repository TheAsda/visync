import { sendMessage } from './sendMessage';

export const createRoom = () =>
  sendMessage({ type: 'create-room' }).then((res) => {
    if (res.type !== 'status') {
      throw new Error('Unexpected response type');
    }
    return res.payload;
  });
