import { fromEvent, interval } from 'rxjs';
import type { VideoInfo } from '../popup/commands/pageVideos';
import {
  sendVideoState,
  startSync,
  stopSync,
  subscribeToVideoState,
  VideoState,
} from './commands/videoState';

let id = 0;

export class Video {
  id: number;
  highlighter: HTMLDivElement | undefined;
  state: VideoState;
  destroyQueue: (() => void)[] = [];

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
      isPlaying: !this.element.paused,
      isSynced: this.destroyQueue.length > 0,
    };
  }

  async startSyncing() {
    console.log('Starting syncing');
    if (this.destroyQueue.length > 0) {
      this.stopSyncing();
    }
    await startSync();
    this.destroyQueue.push(() => {
      stopSync();
    });

    this.state = getVideoState(this.element);

    this.attachVideoListeners();
    this.listenForBackground();
  }

  stopSyncing() {
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

    const timeUpdate$ = fromEvent(this.element, 'timeupdate').subscribe(() => {
      this.state.currentTime = this.element.currentTime;
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

    const stateUpdate = interval(3000).subscribe(this.notifyState.bind(this));
    this.destroyQueue.push(() => stateUpdate.unsubscribe());
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

function detectDocumentVideos(document: Document, oldVideos: Video[]): Video[] {
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

function getDocuments(): Document[] {
  const iframeDocuments = Array.from(
    document.querySelectorAll('iframe'),
    (iframe) => iframe.contentDocument
  ).filter((document) => document !== null);
  return [document, ...iframeDocuments];
}

export function detectVideos(oldVideos: Video[]): Video[] {
  return getDocuments().flatMap((d) => detectDocumentVideos(d, oldVideos));
}

function getVideoState(element: HTMLVideoElement): VideoState {
  return {
    currentTime: element.currentTime,
    playSpeed: element.playbackRate,
    state: element.paused ? 'paused' : 'playing',
  };
}
