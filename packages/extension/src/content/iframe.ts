import { IS_IFRAME } from '../lib/constants';
import {
  handleGetIframeVideoInfo,
  handleGetIframeVideos,
  handleIframeDispatchVideoEvent,
  handleStartIframeSync,
  handleStopIframeSync,
} from './commands/iframeVideo';
import { detectVideos } from './contentVideo';
import { VideoManager } from './videoManager';

function run() {
  let pageVideos: VideoManager[] = [];

  function getVideo(videoId: string): VideoManager {
    const video = pageVideos.find((video) => video.id === videoId);
    if (!video) {
      throw new Error(`Video ${videoId} not found`);
    }
    return video;
  }

  handleGetIframeVideos(async () => {
    pageVideos = detectVideos(pageVideos);
    return Promise.all(pageVideos.map((video) => video.getInfo()));
  });

  handleIframeDispatchVideoEvent(async (event) => {
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

  handleGetIframeVideoInfo(async (videoId) => {
    const video = getVideo(videoId);
    return video.getInfo();
  });

  handleStartIframeSync(async (videoId) => {
    const video = getVideo(videoId);
    await video.startSync();
  });

  handleStopIframeSync(async (videoId) => {
    const video = getVideo(videoId);
    await video.stopSync();
  });
}

if (IS_IFRAME) {
  run();
}
