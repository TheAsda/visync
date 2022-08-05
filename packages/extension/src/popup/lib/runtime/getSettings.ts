import { sendSettings } from '../../../messages/settings';
import { ClientSettings } from '../../../types/settings';

export const getSettings = (): Promise<ClientSettings> => {
  return sendSettings();
};
