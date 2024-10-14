import { fromEvent, interval } from 'rxjs';
import { generateRandomId } from '../lib/randomId';
import type { VideoInfo } from '../popup/commands/pageVideos';
import { sendPing } from './commands/ping';
import {
  sendVideoState,
  startSync,
  stopSync,
  subscribeToVideoState,
  VideoState,
} from './commands/videoState';
import { highlighter } from './highlighter';
import { VideoManager } from './videoManager';

export class ContentVideo implements VideoManager {
  id: string;
  highlighter: HTMLDivElement | undefined;
  state: VideoState;
  destroyQueue: (() => void)[] = [];

  constructor(readonly element: HTMLVideoElement) {
    this.id = generateRandomId();
    this.state = getVideoState(element);
  }

  highlight() {
    highlighter.highligh(this.element);
  }

  unhighlight() {
    highlighter.unhighlight();
  }

  async getInfo(): Promise<VideoInfo> {
    return {
      id: this.id,
      title: this.element.title,
      currentTime: this.element.currentTime,
      duration: this.element.duration,
      playSpeed: this.element.playbackRate,
      isPlaying: !this.element.paused,
      isSynced: this.destroyQueue.length > 0,
    };
  }

  async startSync() {
    console.log('Starting syncing');
    if (this.destroyQueue.length > 0) {
      await this.stopSync();
    }
    await startSync();
    this.destroyQueue.push(() => {
      stopSync();
    });

    this.state = getVideoState(this.element);

    this.attachVideoListeners();
    this.listenForBackground();
    this.startPinging();
  }

  async stopSync() {
    console.log('Stopping syncing');
    this.destroyQueue.forEach((cb) => cb());
    this.destroyQueue.length = 0;
  }

  attachVideoListeners() {
    const play$ = fromEvent(this.element, 'play').subscribe(() => {
      if (this.state.state === 'playing') {
        return;
      }
      this.state.state = 'playing';
      this.notifyState();
    });

    const pause$ = fromEvent(this.element, 'pause').subscribe(() => {
      if (this.state.state === 'paused') {
        return;
      }
      this.state.state = 'paused';
      this.notifyState();
    });

    const timeUpdate$ = fromEvent(this.element, 'seeked').subscribe(() => {
      if (Math.abs(this.element.currentTime - this.state.currentTime) < 1) {
        return;
      }
      this.state.currentTime = this.element.currentTime;
      this.notifyState();
    });

    const playbackRateChange$ = fromEvent(this.element, 'ratechange').subscribe(
      () => {
        if (this.state.playSpeed === this.element.playbackRate) {
          return;
        }
        this.state.playSpeed = this.element.playbackRate;
        this.notifyState();
      }
    );

    this.destroyQueue.push(() => {
      play$.unsubscribe();
      pause$.unsubscribe();
      timeUpdate$.unsubscribe();
      playbackRateChange$.unsubscribe();
    });
  }

  startPinging() {
    const ping = interval(3000).subscribe(() => {
      sendPing();
    });
    this.destroyQueue.push(() => ping.unsubscribe());
  }

  notifyState() {
    sendVideoState(this.state);
  }

  listenForBackground() {
    this.destroyQueue.push(
      subscribeToVideoState((videoState) => {
        if (videoState.state !== this.state.state) {
          if (videoState.state === 'playing') {
            this.state.state = 'playing';
            this.element.play();
          } else if (videoState.state === 'paused') {
            this.state.state = 'paused';
            this.element.pause();
          }
        }
        if (Math.abs(videoState.currentTime - this.state.currentTime) > 1) {
          this.state.currentTime = videoState.currentTime;
          this.element.currentTime = videoState.currentTime;
        }
        if (videoState.playSpeed !== this.state.playSpeed) {
          this.state.playSpeed = videoState.playSpeed;
          this.element.playbackRate = videoState.playSpeed;
        }
      })
    );
  }
}

function detectDocumentVideos(
  document: Document,
  oldVideos: ContentVideo[]
): ContentVideo[] {
  const oldVideosMap = new Map(
    oldVideos.map((video) => [video.element, video])
  );
  return Array.from(document.querySelectorAll('video'), (element) => {
    if (oldVideosMap.has(element)) {
      return oldVideosMap.get(element)!;
    }
    return new ContentVideo(element);
  });
}

export function detectVideos(oldVideos: VideoManager[]): VideoManager[] {
  const videos = oldVideos.filter((v) => v instanceof ContentVideo);
  return detectDocumentVideos(document, videos);
}

function getVideoState(element: HTMLVideoElement): VideoState {
  return {
    currentTime: element.currentTime,
    playSpeed: element.playbackRate,
    state: element.paused ? 'paused' : 'playing',
  };
}
