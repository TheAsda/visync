import {
  dispatchVideoEvent,
  getVideoInfo,
  startSyncVideo,
  stopSyncVideo,
  VideoInfo,
} from '../commands/pageVideos';

export class Video {
  constructor(readonly info: VideoInfo) {}

  highlight() {
    dispatchVideoEvent({ type: 'highlight', id: this.info.id });
  }

  unhighlight() {
    dispatchVideoEvent({ type: 'unhighlight', id: this.info.id });
  }

  startSync() {
    return startSyncVideo(this.info.id);
  }

  stopSync() {
    return stopSyncVideo(this.info.id);
  }

  getInfo() {
    return getVideoInfo(this.info.id);
  }
}
