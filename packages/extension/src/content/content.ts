import {
  handleDispatchVideoEvent,
  handlePageVideos,
  handleStartSyncVideo,
  handleStopSyncVideo,
  onGetVideoInfo,
} from '../popup/commands/pageVideos';
import { detectVideos, Video } from './videoUtils';

let pageVideos: Video[] = [];

function getVideo(videoId: number): Video {
  const video = pageVideos.find((video) => video.id === videoId);
  if (!video) {
    throw new Error(`Video ${videoId} not found`);
  }
  return video;
}

handlePageVideos(async () => {
  pageVideos = detectVideos(pageVideos);
  return pageVideos.map((video) => video.getInfo());
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

onGetVideoInfo(async ({ videoId }) => {
  const video = getVideo(videoId);
  return video.getInfo();
});

handleStartSyncVideo(async (videoId) => {
  const video = getVideo(videoId);
  await video.startSyncing();
});

handleStopSyncVideo(async (videoId) => {
  const video = getVideo(videoId);
  video.stopSyncing();
});
