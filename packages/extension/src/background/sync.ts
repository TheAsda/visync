import { BehaviorSubject, fromEventPattern, map } from 'rxjs';
import { SocketResponse } from 'visync-contracts';
import { sendSync, sync$ } from '../messageStreams/sync';
import { createClientSocket } from './clientSocket';
import { notifySyncStarted, notifySyncStopped } from './notify';
import { clientId, roomId$ } from './store/client';

let syncedTabId$: BehaviorSubject<number> | undefined;

const tabRemoved$ = fromEventPattern<
  [tabId: number, removeInfo: chrome.tabs.TabRemoveInfo]
>(
  (handler) => chrome.tabs.onRemoved.addListener(handler),
  (handler) => chrome.tabs.onRemoved.removeListener(handler)
);

export const isSynced$ = new BehaviorSubject(false);

export const startSyncing = async (tabId: number, videoSelector?: string) => {
  const roomId = roomId$.getValue();
  if (!roomId) {
    throw new Error('Client is not in room');
  }
  syncedTabId$ = new BehaviorSubject(tabId);
  const { messages$, socketInput$ } = createClientSocket(
    roomId,
    await clientId
  );
  const syncSubscription = sync$
    .pipe(map(({ message }) => message))
    .subscribe((request) => {
      socketInput$.next(request);
    });
  const messagesSubscription = messages$
    .pipe(map((value) => JSON.parse(value) as SocketResponse))
    .subscribe((response) => {
      if (response.type === 'room') {
        return;
      }
      sendSync(response, tabId);
    });

  notifySyncStarted(tabId, videoSelector);
  isSynced$.next(true);

  syncedTabId$.subscribe({
    complete: () => {
      isSynced$.next(false);
      notifySyncStopped(tabId);
      messagesSubscription.unsubscribe();
      syncSubscription.unsubscribe();
    },
  });
};

export const stopSyncing = () => {
  syncedTabId$?.complete();
};
