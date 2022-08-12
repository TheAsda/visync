import { createRoot, Root } from 'react-dom/client';
import {
  BehaviorSubject,
  combineLatest,
  combineLatestAll,
  combineLatestWith,
  Subject,
} from 'rxjs';
import { sendSync, syncStream } from '../messages/sync';
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

root$.pipe(combineLatestWith(isSynced$)).subscribe(([root, isSynced]) => {
  console.debug('[ViSync] Render button');
  root.render(
    <SyncButton
      onSyncStart={startSync}
      onSyncStop={stopSync}
      isDisabled={false}
      isSynced={isSynced}
    />
  );
  return () => {
    console.debug('[ViSync] Unmount button');
    root.unmount();
  };
});

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
  } catch (e) {
    console.debug('[ViSync] Failed to attach sync button');
    return;
  }
  console.debug('[ViSync] Attached sync button');
});

observer.observe(document.body, { childList: true, subtree: true });

export {};
