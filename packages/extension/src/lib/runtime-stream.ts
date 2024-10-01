import { Observable, tap } from 'rxjs';

export type RuntimeMessage<T = unknown> = {
  message: T;
  sender: chrome.runtime.MessageSender;
  sendResponse: (response?: any) => void;
};

export const runtime$ = new Observable<RuntimeMessage>((subscriber) => {
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
}).pipe(
  tap((event) => {
    console.debug(`[Runtime] Message:`, event.message);
  })
);
