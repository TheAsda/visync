import { ClientSettings } from '../../../types/settings';
import { sendMessage } from './sendMessage';

export const getSettings = (): Promise<ClientSettings> =>
  sendMessage({ type: 'settings' }).then((res) => {
    if (res.type !== 'settings') {
      throw new Error('Unexpected response type');
    }
    return res.payload;
  });
