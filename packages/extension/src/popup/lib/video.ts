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

  subscribeToVideoChange(callback: (info: VideoInfo) => void) {
    return getVideoInfo(
      (data) => {
        callback(data);
      },
      { videoId: this.info.id }
    );
  }
}
