import type { VideoInfo } from '../popup/commands/pageVideos';

let id = 0;

export class Video {
  id: number;
  highlighter: HTMLDivElement | undefined;
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
    };
  }
}

export function detectVideos(): Video[] {
  return Array.from(
    document.querySelectorAll('video'),
    (element) => new Video(element)
  );
}
