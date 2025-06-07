import {
  handleDispatchVideoEvent,
  handleGetVideoInfo,
  handlePageVideos,
  handleStartSyncVideo,
  handleStopSyncVideo,
} from '../popup/commands/pageVideos';
import { detectVideos } from './contentVideo';
import { detectIframesVideos } from './iframeVideo';
import { VideoManager } from './videoManager';

let pageVideos: VideoManager[] = [];

function getVideo(videoId: string): VideoManager {
  const video = pageVideos.find((video) => video.id === videoId);
  if (!video) {
    throw new Error(`Video ${videoId} not found`);
  }
  return video;
}

handlePageVideos(async () => {
  const contentVideos = detectVideos(pageVideos);
  const iframeVideos = await detectIframesVideos(pageVideos);
  pageVideos = contentVideos.concat(iframeVideos);
  return Promise.all(pageVideos.map((video) => video.getInfo()));
});

handleDispatchVideoEvent(async (event) => {
  const video = getVideo(event.id);

  switch (event.type) {
    case 'highlight':
      video.highlight();
      break;
    case 'unhighlight':
      video.unhighlight();
      break;
  }
});

handleGetVideoInfo(async (videoId) => {
  const video = getVideo(videoId);
  return video.getInfo();
});

handleStartSyncVideo(async (videoId) => {
  const video = getVideo(videoId);
  await video.startSync();
});

handleStopSyncVideo(async (videoId) => {
  const video = getVideo(videoId);
  await video.stopSync();
});
