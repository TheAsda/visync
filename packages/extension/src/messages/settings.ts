import { getMessage } from '@extend-chrome/messages';
import { RuntimeMessage } from '../types/runtimeMessages';
import { ClientSettings } from '../types/settings';

export type SettingsRequest = void | RuntimeMessage<
  'save-settings',
  ClientSettings
>;

export const [sendSettings, settingsStream, waitForSettings] = getMessage<
  SettingsRequest,
  ClientSettings
>('settings', { async: true });
