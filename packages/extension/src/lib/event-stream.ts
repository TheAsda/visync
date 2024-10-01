import { filter, firstValueFrom, fromEventPattern, tap } from 'rxjs';

type StreamEvent<Event = unknown> = {
  name: string;
  event: Event;
  __type: 'stream-event';
};

type SubEvent<SubscribeData = void> = StreamEvent<{
  type: 'SUB';
  data: SubscribeData;
}>;

export type CreateEventStreamOptions = {
  /** If true then command will call the content script in active tab */
  activeTab?: boolean;
};

const ports$ = fromEventPattern<chrome.runtime.Port>(
  (handler) => chrome.runtime.onConnect.addListener(handler),
  (handler) => chrome.runtime.onConnect.removeListener(handler)
);

export const createEventStream = <Event = void>(
  name: string,
  options: CreateEventStreamOptions = {}
) => {
  const { activeTab = false } = options;

  const port$ = ports$.pipe(filter((port) => port.name === name));

  const subscribeToStream = (callback: (message: Event) => void) => {
    const port = firstValueFrom(port$).then((port) => {
      const messages$ = fromEventPattern<[Event, chrome.runtime.Port]>(
        (handler) => port.onMessage.addListener(handler),
        (handler) => port.onMessage.removeListener(handler)
      )
        .pipe(
          tap(([message]) => console.debug(`[EventStream] Message:`, message))
        )
        .subscribe(([message]) => {
          callback(message);
        });
      port.onDisconnect.addListener(() => {
        messages$.unsubscribe();
      });
      return port;
    });
    return () => {
      port.then((p) => p.disconnect());
    };
  };

  let port: chrome.runtime.Port;

  const sendToStream = async (event: Event) => {
    if (!port) {
      port = activeTab
        ? await createPortToActiveTab(name)
        : await createPortToBackground(name);
    }
    port.postMessage(event);
  };

  return [subscribeToStream, sendToStream] as const;
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
