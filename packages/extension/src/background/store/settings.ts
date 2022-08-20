import { BehaviorSubject } from 'rxjs';
import { ClientSettings, defaultSettings } from '../../types/settings';

const initialSettings =
  (await chrome.storage.local.get(['settings'])).settings ?? defaultSettings;
export const clientSettings$ = new BehaviorSubject<ClientSettings>(
  initialSettings
);

clientSettings$.subscribe(async (settings) => {
  await chrome.storage.local.set({ settings });
});
