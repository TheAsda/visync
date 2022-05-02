import { nanoid } from 'nanoid';

export const getClientId = async (): Promise<string> => {
  // NOTE: for some reason this line produces 'Uncaught (in promise) Error: The message port closed before a response was received.' but code works fine
  let clientId = (await chrome.storage.local.get('clientId')).clientId;
  if (clientId) {
    return clientId;
  }
  clientId = nanoid(6);
  await chrome.storage.local.set({ clientId });
  return clientId;
};
