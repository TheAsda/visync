export const forEachTab = async (
  callback: (tabId: number) => void | Promise<void>
) => {
  const tabs = await chrome.tabs.query({});
  return Promise.all(
    tabs
      .filter((tab) => tab.id !== undefined)
      .map((tab) => tab.id!)
      .map(callback)
  );
};
