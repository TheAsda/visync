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
    this.state = this.calculateState();
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
    const callback = this.updateState.bind(this);

    const play$ = fromEvent(this.element, 'play').subscribe(callback);
    const pause$ = fromEvent(this.element, 'pause').subscribe(callback);
    const timeUpdate$ = fromEvent(this.element, 'seeked').subscribe(callback);
    const rateChange$ = fromEvent(this.element, 'ratechange').subscribe(
      callback
    );

    this.destroyQueue.push(() => {
      play$.unsubscribe();
      pause$.unsubscribe();
      timeUpdate$.unsubscribe();
      rateChange$.unsubscribe();
    });
  }

  startPinging() {
    const ping = interval(3000).subscribe(() => {
      sendPing();
    });
    this.destroyQueue.push(() => ping.unsubscribe());
  }

  calculateState() {
    return getVideoState(this.element);
  }

  updateState() {
    const newState = this.calculateState();
    if (
      newState.state === this.state.state &&
      newState.playSpeed === this.state.playSpeed &&
      !isTimeChanged(newState.currentTime, this.state.currentTime)
    ) {
      return;
    }
    this.state = newState;
    this.notifyState();
  }

  notifyState() {
    sendVideoState(this.state);
  }

  listenForBackground() {
    this.destroyQueue.push(
      subscribeToVideoState((videoState) => {
        this.state = this.calculateState();
        if (isTimeChanged(videoState.currentTime, this.state.currentTime)) {
          this.state.currentTime = videoState.currentTime;
          this.element.currentTime = videoState.currentTime;
        }
        if (videoState.playSpeed !== this.state.playSpeed) {
          this.state.playSpeed = videoState.playSpeed;
          this.element.playbackRate = videoState.playSpeed;
        }
        if (videoState.state !== this.state.state) {
          if (videoState.state === 'playing') {
            this.state.state = 'playing';
            this.element.play();
          } else if (videoState.state === 'paused') {
            this.state.state = 'paused';
            this.element.pause();
          }
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

function isTimeChanged(time1: number, time2: number) {
  return Math.abs(time1 - time2) > 1;
}
