import { logger } from '../logger';
import { getTabId, getTabSocket, initializeTabSocket } from '../socket';
import { RuntimeRequestHandler } from './runtimeRequestHandler';

export const pingRequestHandler: RuntimeRequestHandler = async (
  clientId,
  request,
  sender,
  sendResponse
) => {
  if (request.type !== 'ping') {
    return;
  }
  const tabId = sender.tab?.id;
  try {
    if (!tabId || getTabId() === tabId) {
      return;
    }
  } catch {
    return;
  }

  try {
    getTabSocket(tabId);
  } catch {
    logger.warn('Ping means that tab is synced but tab socket does not exist');
    initializeTabSocket(tabId);
  }
};
