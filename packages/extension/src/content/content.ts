import { retrieveRootParamters } from 'elysia/dist/sucrose';
import { interval, tap } from 'rxjs';
import {
  handleDispatchVideoEvent,
  handlePageVideos,
  onDurationSubscribe,
} from '../popup/commands/pageVideos';
import { detectVideos, Video } from './videoUtils';

let pageVideos: Video[] = [];

handlePageVideos(async () => {
  pageVideos = detectVideos();
  return pageVideos.map((video) => video.getInfo());
});

handleDispatchVideoEvent(async (event) => {
  const video = pageVideos.find((video) => video.id === event.id);
  if (!video) {
    console.warn(`Video ${event.id} not found`);
    return;
  }

  switch (event.type) {
    case 'highlight':
      video.highlight();
      break;
    case 'unhighlight':
      video.unhighlight();
      break;
  }
});

onDurationSubscribe(({ videoId }, sendDuration) => {
  const video = pageVideos.find((video) => video.id === videoId);
  if (!video) {
    console.warn(`Video ${videoId} not found`);
    return;
  }
  const subscription = interval(1000).subscribe(() => {
    sendDuration({ currentTime: video.element.currentTime });
  });
  return () => {
    subscription.unsubscribe();
  };
});
