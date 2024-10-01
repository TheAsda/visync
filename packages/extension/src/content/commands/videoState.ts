import { createAsyncCommand } from '../../lib/async-command';
import { createEventStream } from '../../lib/event-stream';

export type PlayState = 'playing' | 'paused';

export type VideoState = {
  state: PlayState;
  currentTime: number;
  playSpeed: number;
};

export const [startSync, handleStartSync] = createAsyncCommand('start-sync');
export const [stopSync, handleStopSync] = createAsyncCommand('stop-sync');
export const [subscribeToContent, sendFromContent] =
  createEventStream<VideoState>('content-video-state');
export const [subscribeToBackground, sendFromBackground] =
  createEventStream<VideoState>('background-video-state');
