import { nanoid } from 'nanoid';
import { ClientId } from 'syncboii-contracts';

const clientIdKey = 'clientId';

export const ensureClientId = async () => {
  const { clientId } = await chrome.storage.local.get(clientIdKey);
  if (clientId) {
    return;
  }
  const newClientId = nanoid(6);
  await chrome.storage.local.set({ clientIdKey: newClientId });
};

export const getClientId = async (): Promise<ClientId> => {
  const { clientId } = await chrome.storage.local.get('clientId');
  if (!clientId) {
    throw new Error('Cannot get client id');
  }
  return clientId;
};
