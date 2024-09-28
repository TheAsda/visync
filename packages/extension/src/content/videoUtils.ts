import { fromEvent, merge, Subscription, tap } from 'rxjs';
import type { VideoInfo } from '../popup/commands/pageVideos';
import {
  eventsStream,
  sendVideoEvent,
  VideoEvent,
} from './commands/videoEvents';

let id = 0;

type VideoState = 'playing' | 'paused';

export class Video {
  id: number;
  highlighter: HTMLDivElement | undefined;
  sync$: Subscription | undefined;
  state: VideoState;

  constructor(readonly element: HTMLVideoElement) {
    this.id = id++;
    this.state = getVideoState(element);
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

  async startSyncing() {
    if (this.sync$) {
      this.stopSyncing();
    }
    await sendVideoEvent({ type: 'start-sync' });

    const play$ = fromEvent(this.element, 'play');
    const pause$ = fromEvent(this.element, 'pause');
    this.state = getVideoState(this.element);

    const stopServerEvents = eventsStream((serverEvent) => {
      console.log('Got server event', serverEvent);
      switch (serverEvent.type) {
        case 'play':
          this.state = 'playing';
          this.element.play();
          break;
        case 'pause':
          this.state = 'paused';
          this.element.pause();
          break;
      }
    });
    this.sync$ = merge(play$, pause$)
      .pipe(
        tap({
          unsubscribe: () => stopServerEvents(),
        })
      )
      .subscribe((event) => {
        if (this.state === getVideoState(this.element)) {
          console.log(`Video is already ${this.state}`);
          return;
        }
        let videoEvent: VideoEvent;
        switch (event.type) {
          case 'play':
          case 'pause':
            videoEvent = {
              type: event.type,
            };
            break;
          default:
            throw new Error(`Unsupported event type: ${event.type}`);
        }
        sendVideoEvent(videoEvent);
        this.state = getVideoState(this.element);
      });
  }

  stopSyncing() {
    if (this.sync$) {
      sendVideoEvent({ type: 'stop-sync' });
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

function getVideoState(element: HTMLVideoElement): VideoState {
  if (element.paused) {
    return 'paused';
  }
  return 'playing';
}
