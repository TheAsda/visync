import { ErrorMessage, sendError } from '../../messageStreams/error';
import { getTabId } from './getTabId';

export const handleError = (
  err: unknown,
  sender: chrome.runtime.MessageSender,
  messageId: string
) => {
  const message: ErrorMessage = {
    message: err instanceof Error ? err.message : 'Unknown error',
    messageId,
  };
  if (sender.tab) {
    const tabId = getTabId(sender);
    sendError(message, tabId);
  } else {
    sendError(message);
  }
};
