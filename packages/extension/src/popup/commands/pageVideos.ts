import { createAsyncCommand } from '../../lib/async-command';
import { createEventStream } from '../../lib/event-stream';

export interface VideoInfo {
  id: number;
  title: string;
  currentTime: number;
  duration: number;
  playSpeed: number;
}

export const [getPageVideos, handlePageVideos] = createAsyncCommand<
  void,
  VideoInfo[]
>('page-videos', { activeTab: true });

export type VideoEvent = {
  type: 'highlight' | 'unhighlight';
  id: number;
};

export const [dispatchVideoEvent, handleDispatchVideoEvent] =
  createAsyncCommand<VideoEvent>('video-event', { activeTab: true });

export const [durationStream, onDurationSubscribe] = createEventStream<
  { videoId: number },
  { currentTime: number }
>('duration-update', { activeTab: true });
