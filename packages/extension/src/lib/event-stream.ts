export type CreateEventStreamOptions = {
  /** If true then command will call the content script in active tab */
  // activeTab?: boolean;
};

export const createEventStream = <Event = void>(
  name: string,
  options: CreateEventStreamOptions = {}
) => {
  const subscribeToStream = (callback: (message: Event) => void) => {
    const disconnect = listenPort(name, callback);
    return async () => {
      console.log('Disconnecting port');
      disconnect();
    };
  };

  const sendToStream = async (event: Event) => {
    const port = getPort(name);
    port.postMessage(event);
  };

  return [subscribeToStream, sendToStream] as const;
};

const portMap = new Map<string, chrome.runtime.Port>();

function getPort(name: string) {
  const port = portMap.get(name);
  if (port) {
    return port;
  }
  const newPort = chrome.runtime.connect({ name });
  portMap.set(name, newPort);
  return newPort;
}

function removePort(name: string) {
  portMap.delete(name);
}

function listenPort<Event>(name: string, callback: (event: Event) => void) {
  const port = getPort(name);

  const reconnectHandler = () => {
    removePort(name);
    listenPort(name, callback);
  };

  port.onMessage.addListener(callback);
  port.onDisconnect.addListener(reconnectHandler);

  const disconnect = () => {
    port.onMessage.removeListener(callback);
    port.onDisconnect.removeListener(reconnectHandler);
  };

  return disconnect;
}
