import { filter, fromEventPattern, map, withLatestFrom } from 'rxjs';
import { roomId$ } from './store/client';
import { state$ } from './store/state';
import { startSyncing, stopSyncing } from './sync';

const syncButtonId = 'sync-button';

const createContextMenuButton = () => {
  chrome.contextMenus.create({
    id: syncButtonId,
    title: 'Sync',
    contexts: ['video'],
  });
};

const toggleContextMenuButtonEnable = (enabled: boolean) => {
  chrome.contextMenus.update(syncButtonId, {
    enabled,
  });
};

const updateContextMenuButtonTitle = (title: 'Sync' | 'Stop sync') => {
  chrome.contextMenus.update(syncButtonId, {
    title,
  });
};

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

createContextMenuButton();

state$.subscribe((state) => {
  if (state.isSynced) {
    updateContextMenuButtonTitle('Stop sync');
  } else {
    updateContextMenuButtonTitle('Sync');
  }
});

contextMenu$
  .pipe(
    map((tab) => tab.id),
    filter((tabId): tabId is number => tabId !== undefined),
    withLatestFrom(state$)
  )
  .subscribe(([tabId, state]) => {
    if (state.isSynced) {
      stopSyncing();
    } else {
      startSyncing(tabId);
    }
  });

roomId$.subscribe((roomId) => {
  toggleContextMenuButtonEnable(roomId !== undefined);
});
