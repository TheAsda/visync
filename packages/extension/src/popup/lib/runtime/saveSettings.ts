import { ClientSettings } from '../../../types/settings';
import { sendMessage } from './sendMessage';

export const saveSettings = (
  settings: ClientSettings
): Promise<ClientSettings> =>
  sendMessage({ type: 'update-settings', payload: settings }).then((res) => {
    if (res.type !== 'settings') {
      throw new Error('Unexpected response type');
    }
    return res.payload;
  });
