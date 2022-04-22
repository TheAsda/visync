import { logger } from '../../logger';
import { RuntimeResponse } from '../../types/runtimeMessages';

export const sendResponseToTabs = async (response: RuntimeResponse) => {
  const message = JSON.stringify(response);
  const tabIds = await chrome.tabs.query({});
  tabIds.forEach((tab) => {
    if (!tab.id) {
      logger.warn('Tab does not have id');
      return;
    }
    chrome.tabs.sendMessage(tab.id, message);
  });
};
