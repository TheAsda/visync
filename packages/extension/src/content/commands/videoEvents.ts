import { createAsyncCommand } from '../../lib/async-command';
import { createEventStream } from '../../lib/event-stream';

export type VideoEvent = {
  type: 'play' | 'pause' | 'start-sync' | 'stop-sync';
};

export const [eventsStream, onVideoEventSubscribe] = createEventStream<void, VideoEvent>(
  'video-sync-events'
);
export const [sendVideoEvent, handleVideoEvent] =
  createAsyncCommand<VideoEvent>('video-sync-event');
