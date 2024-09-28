import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import type { VideoInfo } from '../popup/commands/pageVideos';

let id = 0;

export class Video {
  id: number;
  highlighter: HTMLDivElement | undefined;
  sync$: Subscription | undefined;

  constructor(readonly element: HTMLVideoElement) {
    this.id = id++;
  }

  highlight() {
    if (this.highlighter) {
      this.highlighter.remove();
    }
    const { left, right, top, bottom } = this.element.getBoundingClientRect();
    const highlighter = document.createElement('div');
    highlighter.style.border = '2px solid red';
    highlighter.style.position = 'absolute';
    highlighter.style.left = `${left}px`;
    highlighter.style.top = `${top}px`;
    highlighter.style.width = `${right - left}px`;
    highlighter.style.height = `${bottom - top}px`;
    this.highlighter = highlighter;
    document.body.appendChild(highlighter);
  }

  unhighlight() {
    if (this.highlighter) {
      this.highlighter.remove();
      this.highlighter = undefined;
    }
  }

  getInfo(): VideoInfo {
    return {
      id: this.id,
      title: this.element.title,
      currentTime: this.element.currentTime,
      duration: this.element.duration,
      playSpeed: this.element.playbackRate,
      isSynced: this.sync$ !== undefined,
    };
  }

  startSyncing() {
    if (this.sync$) {
      this.stopSyncing();
    }

    const play$ = fromEvent(this.element, 'play');
    const pause$ = fromEvent(this.element, 'pause');

    this.sync$ = merge(play$, pause$).subscribe((event) => {
      console.log('Video event: ', event.type);
    });
  }

  stopSyncing() {
    if (this.sync$) {
      this.sync$.unsubscribe();
      this.sync$ = undefined;
    }
  }
}

export function detectVideos(oldVideos: Video[]): Video[] {
  const oldVideosMap = new Map(
    oldVideos.map((video) => [video.element, video])
  );
  return Array.from(document.querySelectorAll('video'), (element) => {
    if (oldVideosMap.has(element)) {
      return oldVideosMap.get(element)!;
    }
    return new Video(element);
  });
}
