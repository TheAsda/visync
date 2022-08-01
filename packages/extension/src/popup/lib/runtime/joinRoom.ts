import { sendMessage } from './sendMessage';

export const joinRoom = (roomId: string) =>
  sendMessage({
    type: 'join-room',
    payload: {
      roomId,
    },
  }).then((res) => {
    if (res.type !== 'status') {
      throw new Error('Unexpected response type');
    }
    return res.payload;
  });
