import { VideoInfo } from '../popup/commands/pageVideos';
import {
  dispatchIframeVideoEvent,
  getIframeVideoInfo,
  getIframeVideos,
  startIframeSync,
  stopIframeSync,
} from './commands/iframeVideo';
import { VideoManager } from './videoManager';

export class IframeVideo implements VideoManager {
  id: string;

  constructor(
    private iframe: HTMLIFrameElement,
    videoInfo: VideoInfo
  ) {
    this.id = videoInfo.id;
  }

  highlight(): void {
    dispatchIframeVideoEvent({ id: this.id, type: 'highlight' }, this.iframe);
  }
  unhighlight(): void {
    dispatchIframeVideoEvent({ id: this.id, type: 'unhighlight' }, this.iframe);
  }
  getInfo(): Promise<VideoInfo> {
    return getIframeVideoInfo(this.id, this.iframe);
  }
  startSync(): Promise<void> {
    return startIframeSync(this.id, this.iframe);
  }
  stopSync(): Promise<void> {
    return stopIframeSync(this.id, this.iframe);
  }
}

export async function detectIframesVideos(
  oldVideos: VideoManager[]
): Promise<VideoManager[]> {
  const iframeElements = Array.from(document.querySelectorAll('iframe'));
  const iframeVideos = oldVideos.filter((v) => v instanceof IframeVideo);
  const videos = [];
  for (const iframe of iframeElements) {
    videos.push(...(await detectIframeVideos(iframe, iframeVideos)));
  }
  return videos;
}

async function detectIframeVideos(
  iframe: HTMLIFrameElement,
  oldVideos: IframeVideo[]
): Promise<IframeVideo[]> {
  const oldVideo = new Map(oldVideos.map((v) => [v.id, v]));
  try {
    const infos = await getIframeVideos(undefined, iframe);
    return infos.map((info) => {
      if (oldVideo.has(info.id)) {
        return oldVideo.get(info.id)!;
      }
      return new IframeVideo(iframe, info);
    });
  } catch {
    console.debug('Failed to get iframe videos', iframe);
    return [];
  }
}
