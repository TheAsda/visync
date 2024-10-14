import type {
  CreateEventStream,
  SubscribeToStream,
  SendToStream,
} from './eventStream';

const portMap = new Map<string, chrome.runtime.Port>();

const contentLog = (message: string, ...args: unknown[]) =>
  console.log(`[Content] ${message}`, ...args);

function handleDisconnect(name: string) {
  contentLog(`Port ${name} disconnected`);
  portMap.delete(name);
  createPort(name);
}

function createPort(name: string) {
  if (portMap.has(name)) {
    contentLog(
      'Trying to create port but port already exists, disconnecting existing port'
    );
    portMap.get(name)!.disconnect();
    portMap.delete(name);
  }
  const port = chrome.runtime.connect({ name });
  port.onDisconnect.addListener(handleDisconnect.bind(undefined, name));
  portMap.set(name, port);
  return port;
}

function getPort(name: string) {
  if (portMap.has(name)) {
    return portMap.get(name)!;
  }
  return createPort(name);
}

export const contentImpl: CreateEventStream = <Event = void>(name: string) => {
  const subscribe: SubscribeToStream<Event> = (callback) => {
    contentLog(`Subscribing to port ${name}`);
    let port: chrome.runtime.Port;
    const handleDisconnect = () => {
      contentLog(`Port ${name} disconnected`);
      attachMessageHandler();
    };
    const handleMessage = (event: Event) => {
      contentLog(`Port ${name} received message`, event);
      callback(event);
    };
    const attachMessageHandler = () => {
      port = getPort(name);
      port.onMessage.addListener(handleMessage);
      port.onDisconnect.addListener(handleDisconnect);
    };
    attachMessageHandler();
    return () => {
      contentLog(`Unsubscribing from port ${name}`);
      getPort(name).disconnect();
    };
  };

  const send: SendToStream<Event> = async (event) => {
    contentLog(`Sending message to port ${name}`, event);
    getPort(name).postMessage(event);
  };

  return [subscribe, send];
};
