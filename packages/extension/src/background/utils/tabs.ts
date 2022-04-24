import { logger } from '../../logger';
import { RuntimeResponse } from '../../types/runtimeMessages';
import { getTabId } from '../socket';

export const sendResponseToTabs = async (response: RuntimeResponse) => {
  const tabIds = await chrome.tabs.query({});
  if (response.type === 'status') {
    tabIds.forEach((tab) => {
      if (!tab.id) {
        logger.warn('Tab does not have id');
        return;
      }
      const messageToTab: RuntimeResponse = {
        ...response,
        payload: { ...response.payload, tabIsSynced: getTabId() === tab.id },
      };
      chrome.tabs.sendMessage(tab.id, JSON.stringify(messageToTab));
    });
    return;
  }

  const message = JSON.stringify(response);
  tabIds.forEach((tab) => {
    if (!tab.id) {
      logger.warn('Tab does not have id');
      return;
    }
    chrome.tabs.sendMessage(tab.id, message);
  });
};
