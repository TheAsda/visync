export const getTabId = (sender: chrome.runtime.MessageSender) => {
  if (!sender.tab?.id) {
    throw new Error('Sender is not a tab');
  }
  return sender.tab.id;
};
