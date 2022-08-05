import { sendSettings } from '../../../messages/settings';
import { ClientSettings } from '../../../types/settings';

export const saveSettings = (
  settings: ClientSettings
): Promise<ClientSettings> => {
  return sendSettings({ type: 'save-settings', payload: settings });
};
