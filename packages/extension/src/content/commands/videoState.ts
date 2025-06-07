import { createAsyncCommand } from '../../lib/asyncCommand';
import { createEventStream } from '../../lib/eventStream';

export type PlayState = 'playing' | 'paused';

export type VideoState = {
  state: PlayState;
  currentTime: number;
  playSpeed: number;
};

export const [startSync, handleStartSync] = createAsyncCommand('start-sync');
export const [stopSync, handleStopSync] = createAsyncCommand('stop-sync');
export const [subscribeToVideoState, sendVideoState] =
  createEventStream<VideoState>('video-state');
