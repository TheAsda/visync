import { sendCommand } from '../../../messageStreams/command';
import { ClientSettings } from '../../../types/settings';

export const saveSettings = (settings: ClientSettings) => {
  sendCommand({ type: 'save-settings', payload: settings });
};
