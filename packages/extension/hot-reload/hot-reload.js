async function run() {
  const reloadMessage = 'RELOAD';

  let isBackground;
  try {
    isBackground =
      typeof self !== 'undefined' && self instanceof ServiceWorkerGlobalScope;
  } catch {
    isBackground = false;
  }
  if (isBackground) {
    const socket = new WebSocket(`ws://localhost:8080`);

    // No to let extension go to inactive state
    const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
    chrome.runtime.onStartup.addListener(keepAlive);
    keepAlive();

    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        chrome.tabs.reload();
      }
    });

    socket.addEventListener('message', (event) => {
      if (event.data === 'file-change') {
        chrome.runtime.sendMessage(reloadMessage);
        chrome.runtime.reload();
      }
    });
  } else {
    const isContent =
      typeof chrome !== 'undefined' &&
      typeof window !== 'undefined' &&
      !window.location.href.startsWith('chrome-extension://');
    const contentReadyMessage = 'CONTENT_READY';
    if (isContent) {
      chrome.runtime.onMessage.addListener((message) => {
        if (message === reloadMessage) {
          chrome.runtime.sendMessage(contentReadyMessage);
          chrome.runtime.reload();
        }
      });
    } else {
      chrome.runtime.onMessage.addListener((message) => {
        console.log('Message', message);
        if (message === contentReadyMessage) {
          setTimeout(async () => {
            await chrome.storage.local.set({ 'need-reload': 'true' });
            chrome.runtime.reload();
          }, 750);
        }
      });
      if (await chrome.storage.local.get('need-reload') === 'true') {
        await chrome.storage.local.remove('need-reload');
        location.reload();
      }
    }
  }
}
run();
