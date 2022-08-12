import { BehaviorSubject, filter, map } from 'rxjs';
import { SocketResponse } from 'visync-contracts';
import {
  PauseRequest,
  PlayRequest,
  PlaySpeedRequest,
  RewindRequest,
  sendSync,
  syncStream,
} from '../messages/sync';
import { createClientSocket } from './clientSocket';
import { notifySyncStarted, notifySyncStopped } from './runtimeHelpers';
import { clientStore } from './store/client';

let syncedTabId$: BehaviorSubject<number> | undefined;

export const isSynced$ = new BehaviorSubject(false);

export const startSyncing = (tabId: number, videoSelector?: string) => {
  if (!clientStore.roomId) {
    throw new Error('Client is not in room');
  }
  syncedTabId$ = new BehaviorSubject(tabId);
  const { messages$, socketInput$ } = createClientSocket(
    clientStore.roomId,
    clientStore.clientId
  );
  const syncSubscription = syncStream
    .pipe(
      map(([request]) => request),
      filter(
        (
          request
        ): request is
          | PlayRequest
          | PauseRequest
          | RewindRequest
          | PlaySpeedRequest =>
          ['play', 'pause', 'rewind', 'play-speed'].includes(request.type)
      )
    )
    .subscribe((request) => {
      socketInput$.next(request);
    });
  const messagesSubscription = messages$
    .pipe(map((value) => JSON.parse(value) as SocketResponse))
    .subscribe((response) => {
      if (response.type === 'room') {
        return;
      }
      sendSync(response, { tabId });
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
