import { ClientSettings, defaultSettings } from '../types/settings';

export const getSettings = async (): Promise<ClientSettings> => {
  const { settings } = await chrome.storage.local.get('settings');
  return settings ?? defaultSettings;
};

export const setSettings = async (settings: ClientSettings) => {
  await chrome.storage.local.set({ settings });
};
