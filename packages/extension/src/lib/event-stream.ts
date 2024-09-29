import { filter, fromEventPattern } from 'rxjs';

type StreamEvent<Event = unknown> = {
  name: string;
  event: Event;
  __type: 'stream-event';
};

type SubEvent<SubscribeData = void> = StreamEvent<{
  type: 'SUB';
  data: SubscribeData;
}>;
type UnsubEvent = StreamEvent<'UNSUB'>;

export type CreateEventStreamOptions = {
  /** If true then command will call the content script in active tab */
  activeTab?: boolean;
};

const ports$ = fromEventPattern<chrome.runtime.Port>(
  (handler) => chrome.runtime.onConnect.addListener(handler),
  (handler) => chrome.runtime.onConnect.removeListener(handler)
);

export const createEventStream = <SubscribeData = void, Event = void>(
  name: string,
  options: CreateEventStreamOptions = {}
) => {
  const { activeTab = false } = options;

  const port$ = ports$.pipe(filter((port) => port.name === name));

  const subscribeToStream = (
    callback: (message: Event) => void,
    data: SubscribeData
  ) => {
    let port = activeTab
      ? createPortToActiveTab(name)
      : createPortToBackground(name);
    port = port.then((port) => {
      const messages$ = fromEventPattern<[Event, chrome.runtime.Port]>(
        (handler) => port.onMessage.addListener(handler),
        (handler) => port.onMessage.removeListener(handler)
      ).subscribe(([message]) => {
        callback(message);
      });
      const subEvent: SubEvent<SubscribeData> = {
        name,
        event: { type: 'SUB', data },
        __type: 'stream-event',
      };
      port.postMessage(subEvent);
      port.onDisconnect.addListener(() => messages$.unsubscribe());
      return port;
    });
    return () => {
      port.then((port) => {
        port.disconnect();
      });
    };
  };

  const onStreamSubscribe = (
    callback: (
      data: SubscribeData,
      sendToStream: (event: Event) => void
    ) => (() => void) | void
  ) => {
    port$.subscribe((port) => {
      const sendToStream = (event: Event) => {
        port.postMessage(event);
      };
      let unsub: (() => void) | void;
      port.onMessage.addListener((message) => {
        if (isSubEvent<SubscribeData>(message)) {
          unsub = callback(message.event.data, sendToStream);
          port.onDisconnect.addListener(() => {
            unsub?.();
          });
          return;
        }
        throw new Error('Unknown message', message);
      });
    });
  };

  return [subscribeToStream, onStreamSubscribe] as const;
};

function isSubEvent<SubscribeData = void>(
  event: StreamEvent
): event is SubEvent<SubscribeData> {
  return (
    typeof event.event === 'object' &&
    event.event !== null &&
    'type' in event.event &&
    event.event.type === 'SUB'
  );
}

async function createPortToActiveTab(name: string) {
  const tabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (tabs.length === 0) {
    throw new Error('No active tab found');
  }
  return chrome.tabs.connect(tabs[0].id!, { name });
}

async function createPortToBackground(name: string) {
  return chrome.runtime.connect({ name });
}
