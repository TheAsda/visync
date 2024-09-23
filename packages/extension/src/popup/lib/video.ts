import { dispatchVideoEvent } from '../commands/pageVideos';

export class Video {
  constructor(readonly index: number) {}

  highlight() {
    dispatchVideoEvent({ type: 'highlight', index: this.index });
  }

  unhighlight() {
    dispatchVideoEvent({ type: 'unhighlight', index: this.index });
  }

  sync() {
    throw new Error('Not implemented');
  }
}
