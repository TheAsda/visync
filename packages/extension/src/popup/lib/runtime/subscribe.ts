import { RuntimeResponse } from '../../../types/runtimeMessages';

export const subscribe = (callback: (response: RuntimeResponse) => void) => {
  const handler = (message: string) => {
    const response = JSON.parse(message) as RuntimeResponse;
    callback(response);
  };

  chrome.runtime.onMessage.addListener(handler);
  return () => chrome.runtime.onMessage.removeListener(handler);
};
