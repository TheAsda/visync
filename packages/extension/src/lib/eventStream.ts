import { IS_CONTENT } from './constants';
import { contentImpl } from './eventStream.content';

export type SubscribeToStream<Event> = (
  callback: (message: Event) => void
) => () => void;
export type SendToStream<Event> = (event: Event) => Promise<void>;

export type CreateEventStream = <Event = void>(
  name: string
) => [SubscribeToStream<Event>, SendToStream<Event>];

export const createEventStream = <Event = void>(name: string) => {
  if (IS_CONTENT) {
    return contentImpl<Event>(name);
  }
  return backgroundImpl<Event>(name);
};

const callbacksMap = new Map<string, (event: any) => void>();

const backgroundLog = (message: string, ...args: unknown[]) =>
  console.log(`[Background] ${message}`, ...args);

const bgPortMap = new Map<string, Set<chrome.runtime.Port>>();

chrome.runtime.onConnect.addListener((port) => {
  backgroundLog(`Port ${port.name} connected`);
  let set = bgPortMap.get(port.name);
  if (!set) {
    set = new Set<chrome.runtime.Port>();
    bgPortMap.set(port.name, set);
  }
  set.add(port);
  port.onMessage.addListener((event) => {
    const callback = callbacksMap.get(port.name);
    if (callback) {
      backgroundLog(`Port ${port.name} received message`, event);
      callback(event);
    }
  });
  port.onDisconnect.addListener(() => {
    backgroundLog(`Port ${port.name} disconnected`);
    bgPortMap.get(port.name)?.delete(port);
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
    const portSet = bgPortMap.get(name);
    if (!portSet) {
      backgroundLog(`Port ${name} not found`);
      return;
    }
    backgroundLog(`Sending message to port ${name} (${portSet.size})`, event);
    portSet.forEach((port) => port.postMessage(event));
  };

  return [subscribe, send];
};
