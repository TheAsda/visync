function run() {
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
    chrome.runtime.onMessage.addListener((message) => {
      if (message === reloadMessage) {
        setTimeout(() => {
          if (location) {
            location.reload();
          } else {
            chrome.runtime.reload();
          }
        }, 750);
      }
    });
  }
}
run();
