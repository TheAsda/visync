import { Status } from '../../../types/status';
import { sendMessage } from './sendMessage';

export const getStatus = (): Promise<Status> =>
  sendMessage({ type: 'status' }).then((res) => {
    if (res.type !== 'status') {
      throw new Error('Unexpected response type');
    }
    return res.payload;
  });
