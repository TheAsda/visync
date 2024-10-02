type SubscribeToStream<Event> = (
  callback: (message: Event) => void
) => () => void;
type SendToStream<Event> = (event: Event) => Promise<void>;

type CreateEventStream = <Event = void>(
  name: string
) => [SubscribeToStream<Event>, SendToStream<Event>];

const isContent =
  typeof chrome !== 'undefined' &&
  typeof window !== 'undefined' &&
  !window.location.href.startsWith('chrome-extension://');

export const createEventStream = <Event = void>(name: string) => {
  if (isContent) {
    return contentImpl<Event>(name);
  }
  return backgroundImpl<Event>(name);
};

const portMap = new Map<string, chrome.runtime.Port>();

const contentLog = (message: string, ...args: unknown[]) =>
  console.log(`[Content] ${message}`, ...args);

const contentImpl: CreateEventStream = <Event = void>(name: string) => {
  let port = portMap.get(name);
  if (!port) {
    contentLog(`Creating port ${name}`);
    port = chrome.runtime.connect({ name });
    portMap.set(name, port);
  } else {
    contentLog(`Reusing port ${name}`);
  }

  const subscribe: SubscribeToStream<Event> = (callback) => {
    contentLog(`Subscribing to port ${name}`);
    port.onMessage.addListener((event) => {
      contentLog(`Port ${name} received message`, event);
      callback(event);
    });
    return () => {
      contentLog(`Unsubscribing from port ${name}`);
      port.onMessage.removeListener(callback);
    };
  };

  const send: SendToStream<Event> = async (event) => {
    contentLog(`Sending message to port ${name}`, event);
    port.postMessage(event);
  };

  return [subscribe, send];
};

const callbacksMap = new Map<string, (event: any) => void>();

const backgroundLog = (message: string, ...args: unknown[]) =>
  console.log(`[Background] ${message}`, ...args);

chrome.runtime.onConnect.addListener((port) => {
  backgroundLog(`Port ${port.name} connected`);
  portMap.set(port.name, port);
  port.onMessage.addListener((event) => {
    const callback = callbacksMap.get(port.name);
    if (callback) {
      backgroundLog(`Port ${port.name} received message`, event);
      callback(event);
    }
  });
  port.onDisconnect.addListener(() => {
    backgroundLog(`Port ${port.name} disconnected`);
    portMap.delete(port.name);
  });
});

const backgroundImpl: CreateEventStream = <Event = void>(name: string) => {
  const subscribe: SubscribeToStream<Event> = (callback) => {
    backgroundLog(`Subscribing to port ${name}`);
    callbacksMap.set(name, callback);
    return () => {
      backgroundLog(`Unsubscribing from port ${name}`);
      callbacksMap.delete(name);
    };
  };

  const send: SendToStream<Event> = async (event) => {
    const port = portMap.get(name);
    if (!port) {
      backgroundLog(`Port ${name} not found`);
      return;
    }
    backgroundLog(`Sending message to port ${name}`, event);
    port.postMessage(event);
  };

  return [subscribe, send];
};
