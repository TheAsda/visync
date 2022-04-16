import { nanoid } from 'nanoid';
import { createRoot } from 'react-dom/client';
import { logger } from '../logger';
import { Syncer } from './components/Syncer';

export const attachSyncer = (video: HTMLVideoElement) => {
  const syncContainer = document.createElement('div');
  syncContainer.style.position = 'absolute';
  syncContainer.style.top = '0';
  syncContainer.style.right = '0';
  syncContainer.style.zIndex = '10000';
  document.body.appendChild(syncContainer);
  const root = createRoot(syncContainer);
  root.render(<Syncer video={video} />);
};
