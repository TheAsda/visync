import { createRoot, Root } from 'react-dom/client';
import { SyncButton } from './components/SyncButton';

const controlsSelector = 'div.BottomControls_controls__PEIx2';
const subsButtonSelector = 'div:nth-child(10)';

let root: Root;

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

  root = createRoot(shadowRoot);

  root.render(<SyncButton videoSelector="video" />);

  controls.insertBefore(shadowRootElement, subsButton);
};

const detachSyncButton = () => {
  root?.unmount();
};

const observer = new MutationObserver(() => {
  if (document.querySelector('#visync-shadow-root')) {
    console.debug('[ViSync] Button is already attached');
    return;
  }
  try {
    attachSyncButton();
  } catch (e) {
    detachSyncButton();
    console.debug('[ViSync] Failed to attach sync button');
    return;
  }
  console.debug('[ViSync] Attached sync button');
});

observer.observe(document.body, { childList: true, subtree: true });
