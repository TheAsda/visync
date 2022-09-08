import { BehaviorSubject, from, tap } from 'rxjs';
import { startSyncing } from '../sync';

export type State = {
  isSynced: boolean;
  tabId?: number;
  videoSelector?: string;
};

export const state$ = new BehaviorSubject<State>({ isSynced: false });

state$.subscribe((state) => {
  chrome.storage.local.set({ isSynced: state.isSynced });
  chrome.storage.local.set({ tabId: state.tabId });
  chrome.storage.local.set({ videoSelector: state.videoSelector });
});

from(
  chrome.storage.local
    .get(['isSynced', 'tabId', 'videoSelector'])
    .then((value) => ({
      isSynced: value.isSynced ?? false,
      tabId: value.tabId ?? undefined,
      videoSelector: value.videoSelector ?? undefined,
    }))
)
  .pipe(
    tap((state) => {
      if (state.isSynced && state.tabId !== undefined) {
        startSyncing(state.tabId, state.videoSelector);
      }
    })
  )
  .subscribe((state) => state$.next(state));
