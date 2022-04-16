import { nanoid } from 'nanoid';
import { createRoot } from 'react-dom/client';
import { logger } from '../logger';
import { Syncer } from './components/Syncer';

export const attachSyncer = (video: HTMLVideoElement) => {
  const coords = getCoords(video);
  const syncContainer = document.createElement('div');
  syncContainer.style.position = 'absolute';
  syncContainer.style.top = `${coords.top}px`;
  syncContainer.style.right = `${coords.right}px`;
  syncContainer.style.zIndex = '10000';
  document.body.appendChild(syncContainer);
  const root = createRoot(syncContainer);
  root.render(<Syncer video={video} />);
};

function getCoords(elem: HTMLElement) {
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docEl = document.documentElement;

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  var top = box.top + scrollTop - clientTop;
  var right =
    body.scrollWidth - (box.left + scrollLeft - clientLeft + box.width);

  return { top: Math.round(top), right: Math.round(right) };
}
