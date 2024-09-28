import {
  dispatchVideoEvent,
  durationStream,
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

  sync() {
    throw new Error('Not implemented');
  }

  subscribeToDurationChange(callback: (currentTime: number) => void) {
    return durationStream(
      (data) => {
        callback(data.currentTime);
      },
      { videoId: this.info.id }
    );
  }
}
