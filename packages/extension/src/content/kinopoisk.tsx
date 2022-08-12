import { createRoot, Root } from 'react-dom/client';
import { BehaviorSubject, combineLatest, filter, Subject } from 'rxjs';
import { sendSync, syncStream } from '../messages/sync';
import { tabStatusStream, sendTabStatus } from '../messages/tabStatus';
import { SyncButton } from './components/SyncButton';

const controlsSelector =
  'body > div.ReactModalPortal > div > div > div > div > div > div > div > div > div.Layout__bottom--1eyDI > div.BottomControls__controls--20Sbh';
const subsButtonSelector = 'div:nth-child(10)';

const startSync = () => {
  sendSync({ type: 'start-sync', payload: { videoSelector: 'video' } });
};
const stopSync = () => {
  sendSync({ type: 'stop-sync' });
};

const isDisabled$ = new BehaviorSubject(false);
const isSynced$ = new BehaviorSubject(false);
const root$ = new Subject<Root>();

syncStream
  .pipe(filter(([request]) => request.type === 'sync-started'))
  .subscribe(() => {
    isSynced$.next(true);
  });
syncStream
  .pipe(filter(([request]) => request.type === 'sync-stopped'))
  .subscribe(() => {
    isSynced$.next(false);
  });

tabStatusStream.subscribe(([status]) => {
  isDisabled$.next(
    (status.isSynced && !status.isTabSynced) || !status.isInRoom
  );
  isSynced$.next(status.isTabSynced);
});

combineLatest([root$, isSynced$, isDisabled$]).subscribe(
  ([root, isSynced, isDisabled]) => {
    console.debug('[ViSync] Render button');
    root.render(
      <SyncButton
        onSyncStart={startSync}
        onSyncStop={stopSync}
        isDisabled={isDisabled}
        isSynced={isSynced}
      />
    );
  }
);

syncStream.subscribe(([request]) => {
  switch (request.type) {
    case 'sync-started':
      isSynced$.next(true);
      break;
    case 'sync-stopped':
      isSynced$.next(false);
      break;
    default:
      break;
  }
});

const attachSyncButton = () => {
  const controls = document.querySelector(controlsSelector);
  if (!controls) {
    throw new Error('Cannot find controls');
  }

  const subsButton = controls.querySelector(subsButtonSelector);
  if (!subsButton) {
    throw new Error('Cannot find subs button');
  }

  const shadowRootElement = document.createElement('div');
  shadowRootElement.id = 'visync-shadow-root';
  const shadowRoot = shadowRootElement.attachShadow({ mode: 'open' });

  const root = createRoot(shadowRoot);
  root$.next(root);

  controls.insertBefore(shadowRootElement, subsButton);
};

const observer = new MutationObserver(() => {
  if (document.querySelector('#visync-shadow-root')) {
    console.debug('[ViSync] Button is already attached');
    return;
  }
  try {
    attachSyncButton();
    sendTabStatus({ isInRoom: false, isSynced: false, isTabSynced: false });
  } catch (e) {
    console.debug('[ViSync] Failed to attach sync button');
    return;
  }
  console.debug('[ViSync] Attached sync button');
});

observer.observe(document.body, { childList: true, subtree: true });

export {};
