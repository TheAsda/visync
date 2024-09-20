import { Observable } from 'rxjs';

export type RuntimeEvent<T = unknown> = {
  message: T;
  sender: chrome.runtime.MessageSender;
  sendResponse: (response?: any) => void;
};

export const runtime$ = new Observable<RuntimeEvent>((subscriber) => {
  const handler = (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    subscriber.next({ message, sender, sendResponse });
    return true;
  };
  chrome.runtime.onMessage.addListener(handler);
  return () => {
    chrome.runtime.onMessage.removeListener(handler);
  };
});
