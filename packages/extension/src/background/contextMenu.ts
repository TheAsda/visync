import {
  BehaviorSubject,
  combineLatestWith,
  defaultIfEmpty,
  filter,
  fromEventPattern,
  map,
  Subject,
} from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { SocketResponse } from 'visync-contracts';
import { sendSync, syncStream } from '../messages/sync';
import { serverUrl } from './fetcher';
import { clientStore } from './store/client';

const address = serverUrl.replace('http', 'ws');

const syncButtonId = 'sync-button';

chrome.contextMenus.create({
  id: syncButtonId,
  title: 'Sync',
  contexts: ['video'],
});

clientStore.roomId$.subscribe((roomId) => {
  chrome.contextMenus.update(syncButtonId, {
    enabled: !!roomId,
  });
});

const contextMenu$ = fromEventPattern<
  [chrome.contextMenus.OnClickData, chrome.tabs.Tab | undefined]
>(
  (handler) => chrome.contextMenus.onClicked.addListener(handler),
  (handler) => chrome.contextMenus.onClicked.removeListener(handler)
).pipe(
  filter(
    ([info, tab]) => info.menuItemId === syncButtonId && tab !== undefined
  ),
  map(([info, tab]) => tab as chrome.tabs.Tab)
);
const syncedTabId$ = new BehaviorSubject<number | undefined>(undefined);

contextMenu$.subscribe((tab) => {
  const syncedTabId = syncedTabId$.getValue();
  if (syncedTabId) {
    syncedTabId$.next(undefined);
    return;
  }
  syncedTabId$.next(tab.id);
});

let socket$: WebSocketSubject<SocketResponse>;

syncedTabId$.subscribe((tabId) => {
  if (!tabId) {
    chrome.contextMenus.update(syncButtonId, {
      title: 'Sync',
    });
    sendSync({ type: 'sync-stopped' }, { tabId });
    socket$?.complete();
    return;
  }
  chrome.contextMenus.update(syncButtonId, {
    title: 'Stop sync',
  });
  sendSync({ type: 'sync-started', payload: {} }, { tabId });

  socket$ = webSocket<SocketResponse>(
    `${address}/rooms/${clientStore.roomId}/socket?clientId=${clientStore.clientId}`
  );

  socket$.subscribe((response) => {
    if (response.type === 'room') {
      return;
    }
    sendSync(response, { tabId });
  });

  syncStream.subscribe(async ([request]) => {
    if (request.type === 'sync-started' || request.type === 'sync-stopped') {
      return;
    }
    socket$.next(request);
  });
});
