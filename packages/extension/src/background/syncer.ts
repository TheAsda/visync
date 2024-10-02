import { filter, fromEventPattern } from 'rxjs';
import {
  sendFromBackground,
  subscribeToContent,
} from '../content/commands/videoState';
import { apiClient } from './apiClient';
import { getClientId } from './clientId';
import { startKeepAlive, stopKeepAlive } from './keepAlive';

const tabRemove$ = fromEventPattern<
  [tabId: number, removeInfo: chrome.tabs.TabRemoveInfo]
>(
  (handler) => chrome.tabs.onRemoved.addListener(handler),
  (handler) => chrome.tabs.onRemoved.removeListener(handler)
);

const tabUpdated$ = fromEventPattern<
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

  const tabRemovedSub = tabRemove$
    .pipe(filter(([removedTabId]) => removedTabId === tabId))
    .subscribe(() => {
      console.log('Tab closed, destroying syncer');
      destroy();
    });
  destroyQueue.push(() => tabRemovedSub.unsubscribe());

  const tabUpdatedSub = tabUpdated$
    .pipe(filter(([tabId]) => tabId === tabId))
    .subscribe(([_, info]) => {
      if (info.status === 'loading') {
        console.log('Tab updated, destroying syncer');
        destroy();
      }
    });
  destroyQueue.push(() => tabUpdatedSub.unsubscribe());

  startKeepAlive();
  destroyQueue.push(stopKeepAlive);

  return destroy;
}
