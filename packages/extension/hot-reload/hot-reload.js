/**
 * If development, this code will be appended to background script file.
 */
const socket = new WebSocket(
  `ws://localhost:8080`
);

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
  console.log(event.data);
  if (event.data === 'file-change') {
    chrome.runtime.reload();
  }
});
