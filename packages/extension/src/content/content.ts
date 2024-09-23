import {
  handleDispatchVideoEvent,
  handlePageVideos,
} from '../popup/commands/pageVideos';
import { VideoDetector } from './videoDetector';

const videoDetector = new VideoDetector();

const observer = new MutationObserver(() => {
  videoDetector.updateVideos();
});

observer.observe(document.body, { subtree: true, childList: true });

handlePageVideos(async () => {
  return videoDetector.videos;
});

const higlighters = new Map<number, HTMLDivElement>();

handleDispatchVideoEvent(async (event) => {
  const video = videoDetector.videos[event.index];
  if (!video) {
    console.warn(`Video ${event.index} not found`);
    return;
  }

  switch (event.type) {
    case 'highlight':
      const { left, right, top, bottom } = video.getBoundingClientRect();
      const highligter = document.createElement('div');
      highligter.style.border = '2px solid red';
      highligter.style.position = 'absolute';
      highligter.style.left = `${left}px`;
      highligter.style.top = `${top}px`;
      highligter.style.width = `${right - left}px`;
      highligter.style.height = `${bottom - top}px`;
      higlighters.set(event.index, highligter);
      document.body.appendChild(highligter);
      break;
    case 'unhighlight':
      higlighters.get(event.index)?.remove();
      break;
  }
});
