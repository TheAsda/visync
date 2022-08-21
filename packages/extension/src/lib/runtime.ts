import { filter, fromEventPattern, map, ReplaySubject, share } from 'rxjs';

type RuntimeMessage<T = any> = { stream: string; message: T };

const runtime$ = fromEventPattern<
  [
    message: RuntimeMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ]
>(
  (handler) => chrome.runtime.onMessage.addListener(handler),
  (handler) => chrome.runtime.onMessage.removeListener(handler)
).pipe(
  map(([message, sender, sendResponse]) => ({
    message,
    sender,
  }))
);

export type CreateStreamOptions<Message> = {};

export const createMessageStream = <Message = any>(
  name: string,
  options?: CreateStreamOptions<Message>
) => {
  let stream$ = runtime$.pipe(
    filter(({ message }) => message.stream === name),
    map(({ message, sender }) => ({
      message: message.message as Message,
      sender,
    }))
  );

  /** Used to send message to stream */
  const sendToStream = (message: Message, tabId?: number) => {
    const runtimeMessage: RuntimeMessage = {
      stream: name,
      message: message,
    };
    if (tabId) {
      chrome.tabs.sendMessage(tabId, runtimeMessage);
    } else {
      chrome.runtime.sendMessage(runtimeMessage);
    }
  };
  return [stream$, sendToStream] as const;
};
