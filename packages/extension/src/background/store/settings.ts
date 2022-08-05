import { ClientSettings, defaultSettings } from '../../types/settings';

class SettingsStore {
  private _settings: ClientSettings | undefined;

  constructor() {
    chrome.storage.local.get(['settings']).then(({ settings }) => {
      this._settings = settings ?? defaultSettings;
    });
  }

  get settings(): ClientSettings {
    if (!this._settings) {
      throw new Error('Settings not initialized');
    }
    return this._settings;
  }

  async saveSettings(settings: ClientSettings): Promise<ClientSettings> {
    this._settings = settings;
    await chrome.storage.local.set({ settings });
    return this.settings;
  }
}

export const settingsStore = new SettingsStore();
