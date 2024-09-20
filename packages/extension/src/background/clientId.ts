import { nanoid } from 'nanoid';

export const getClientId = async (): Promise<string> => {
  let clientId = (await chrome.storage.local.get('clientId')).clientId;
  if (clientId) {
    return clientId;
  }
  clientId = nanoid(6);
  await chrome.storage.local.set({ clientId: clientId });
  return clientId;
};
