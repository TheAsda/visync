const keepAlive = () => chrome.runtime.getPlatformInfo();

let interval: number | null;

export function startKeepAlive() {
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(keepAlive, 20e3) as unknown as number;
}

export function stopKeepAlive() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}
