import { filter, fromEventPattern } from 'rxjs';
import {
  sendFromBackground,
  subscribeToContent,
} from '../content/commands/videoState';
import { apiClient } from './apiClient';
import { getClientId } from './clientId';
import { startKeepAlive, stopKeepAlive } from './keepAlive';

const tabUpdate$ = fromEventPattern<
  [tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab]
>(
  (handler) => chrome.tabs.onUpdated.addListener(handler),
  (handler) => chrome.tabs.onUpdated.removeListener(handler)
);

export async function startSyncing(tabId: number) {
  const destroyQueue: (() => void)[] = [];
  const destroy = () => {
    destroyQueue.forEach((cb) => cb());
  };

  const clientId = await getClientId();
  const socket = apiClient.clients({ clientId }).socket.subscribe();
  destroyQueue.push(() => socket.close());

  socket.subscribe((message) => {
    sendFromBackground(message.data);
  });

  destroyQueue.push(
    subscribeToContent((videoState) => {
      socket.send(videoState);
    })
  );

  const tabChangeSub = tabUpdate$
    .pipe(filter(([changedTabId]) => changedTabId === tabId))
    .subscribe(() => {
      destroy();
    });
  destroyQueue.push(() => tabChangeSub.unsubscribe());

  startKeepAlive();
  destroyQueue.push(stopKeepAlive);

  return destroy;
}
