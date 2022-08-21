import { sendCommand } from '../../../messageStreams/command';
import { ClientSettings } from '../../../types/settings';

export const saveSettings = (settings: ClientSettings) => {
  return sendCommand({ type: 'save-settings', payload: settings });
};
