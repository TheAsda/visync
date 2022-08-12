import {
  BehaviorSubject,
  combineLatestWith,
  filter,
  fromEventPattern,
  map,
  pairwise,
  share,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import makeWebSocketObservable from 'rxjs-websockets';
import { SocketRequest, SocketResponse } from 'visync-contracts';
import { forEachTab } from '../messages/forEachTab';
import {
  sendSync,
  StartSyncRequest,
  SyncRequest,
  syncStream,
} from '../messages/sync';
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

syncStream.subscribe(([request, sender]) => {
  if (!sender.tab?.id) {
    console.warn('Sender is not a tab');
    return;
  }
  switch (request.type) {
    case 'start-sync': {
      const syncedTabId = syncedTabId$.getValue();
      if (syncedTabId) {
        syncedTabId$.next(undefined);
      }
      syncedTabId$.next(sender.tab.id);
      break;
    }
    case 'stop-sync': {
      syncedTabId$.next(undefined);
      break;
    }
  }
});

syncedTabId$
  .pipe(
    filter((tabId) => tabId !== undefined),
    combineLatestWith(
      syncStream.pipe(
        map(([request]) => request),
        filter(
          (request): request is StartSyncRequest =>
            request.type === 'start-sync'
        )
      )
    )
  )
  .subscribe(([syncedTabId, request]) => {
    sendSync(
      {
        type: 'sync-started',
        payload: { videoSelector: request.payload.videoSelector },
      },
      { tabId: syncedTabId }
    );
  });

let messagesSubscription: Subscription;

syncedTabId$.subscribe((tabId) => {
  if (!tabId) {
    chrome.contextMenus.update(syncButtonId, {
      title: 'Sync',
    });
    forEachTab((tabId) => {
      sendSync({ type: 'sync-stopped' }, { tabId });
    });
    messagesSubscription?.unsubscribe();
    return;
  }
  chrome.contextMenus.update(syncButtonId, {
    title: 'Stop sync',
  });
  const socketAddress = `${address}/rooms/${clientStore.roomId}/socket?clientId=${clientStore.clientId}`;

  const socket$ = makeWebSocketObservable(socketAddress);
  const socketInput$ = new Subject<SocketRequest>();
  const messages$ = socket$.pipe(
    switchMap((getResponses) => {
      return getResponses(
        socketInput$.pipe(map((request) => JSON.stringify(request)))
      );
    }),
    share()
  );

  syncStream.subscribe(async ([request]) => {
    if (
      request.type === 'sync-started' ||
      request.type === 'sync-stopped' ||
      request.type === 'start-sync' ||
      request.type === 'stop-sync'
    ) {
      return;
    }
    socketInput$.next(request);
  });

  messagesSubscription = messages$
    .pipe(map((value) => JSON.parse(value.toString()) as SocketResponse))
    .subscribe((response) => {
      if (response.type === 'room') {
        return;
      }
      sendSync(response, { tabId });
    });
});
