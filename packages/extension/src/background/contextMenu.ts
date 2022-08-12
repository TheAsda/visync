import { useDebugValue } from 'react';
import {
  BehaviorSubject,
  combineLatestWith,
  filter,
  finalize,
  fromEventPattern,
  map,
  share,
  Subject,
  Subscription,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import makeWebSocketObservable from 'rxjs-websockets';
import { SocketRequest, SocketResponse } from 'visync-contracts';
import { sendClient } from '../messages/client';
import { forEachTab } from '../messages/forEachTab';
import { sendSync, StartSyncRequest, syncStream } from '../messages/sync';
import { sendTabStatus } from '../messages/tabStatus';
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
export const syncedTabId$ = new BehaviorSubject<number | undefined>(undefined);

contextMenu$
  .pipe(
    map((tab) => tab.id),
    filter((tabId): tabId is number => tabId !== undefined)
  )
  .subscribe((tabId) => {
    const syncedTabId = syncedTabId$.getValue();
    if (syncedTabId) {
      syncedTabId$.complete();
      return;
    }
    syncedTabId$.next(tabId);
  });

syncStream
  .pipe(withLatestFrom(syncedTabId$))
  .subscribe(([[request, sender], syncedTabId]) => {
    if (!sender.tab?.id) {
      console.warn('Sender is not a tab');
      return;
    }
    switch (request.type) {
      case 'start-sync': {
        if (syncedTabId) {
          syncedTabId$.complete();
        }
        syncedTabId$.next(sender.tab.id);
        break;
      }
      case 'stop-sync': {
        syncedTabId$.complete();
        break;
      }
    }
  });

const ensureTabId = (tabId: number | undefined): tabId is number =>
  tabId !== undefined;

syncedTabId$
  .pipe(
    filter(ensureTabId),
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
        sendSync(response, { tabId: syncedTabId });
      });

    sendSync(
      {
        type: 'sync-started',
        payload: { videoSelector: request.payload.videoSelector },
      },
      { tabId: syncedTabId }
    );
  });

let messagesSubscription: Subscription;

syncedTabId$.subscribe({
  next: (syncedTabId) => {
    forEachTab((tabId) => {
      sendTabStatus(
        {
          isSynced: syncedTabId !== undefined,
          isTabSynced: syncedTabId === tabId,
          isInRoom: clientStore.roomId !== undefined,
        },
        { tabId }
      );
    });
    sendTabStatus({
      isSynced: syncedTabId !== undefined,
      isTabSynced: false,
      isInRoom: clientStore.roomId !== undefined,
    });
  },
  complete: () => {
    chrome.contextMenus.update(syncButtonId, {
      title: 'Sync',
    });
    forEachTab((tabId) => {
      sendSync({ type: 'sync-stopped' }, { tabId });
    });
    messagesSubscription?.unsubscribe();
    forEachTab((tabId) => {
      sendTabStatus(
        {
          isSynced: false,
          isTabSynced: false,
          isInRoom: clientStore.roomId !== undefined,
        },
        { tabId }
      );
    });
    sendTabStatus({
      isSynced: false,
      isTabSynced: false,
      isInRoom: clientStore.roomId !== undefined,
    });
  },
});
