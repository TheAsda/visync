import { fromEventPattern } from 'rxjs';
import { getClientId } from './clientId';

fromEventPattern<[chrome.runtime.InstalledDetails]>(
  (handler) => chrome.runtime.onInstalled.addListener(handler),
  (handler) => chrome.runtime.onInstalled.removeListener(handler)
).subscribe(() => {
  getClientId();
});
