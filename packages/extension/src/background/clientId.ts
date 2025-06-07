import { generateRandomId } from '../lib/randomId';

export const getClientId = async (): Promise<string> => {
  let clientId = (await chrome.storage.local.get('clientId')).clientId;
  if (clientId) {
    return clientId;
  }
  clientId = generateRandomId();
  await chrome.storage.local.set({ clientId: clientId });
  return clientId;
};
