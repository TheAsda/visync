import { nanoid } from 'nanoid';
import { ClientId } from 'syncboii-contracts';

const clientIdKey = 'clientId';

export const getClientId = async (): Promise<ClientId> => {
  let clientId = (await chrome.storage.local.get('clientId')).clientId;
  if (clientId) {
    return clientId;
  }
  clientId = nanoid(6);
  await chrome.storage.local.set({ clientId });
  return clientId;
};
