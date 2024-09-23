import { createAsyncCommand } from '../../lib/async-command';

export interface Video {}

export const [getPageVideos, handlePageVideos] = createAsyncCommand<
  void,
  Video[]
>('page-videos', { activeTab: true });

export type VideoEvent = {
  type: 'highlight' | 'unhighlight';
  index: number;
};

export const [dispatchVideoEvent, handleDispatchVideoEvent] =
  createAsyncCommand<VideoEvent>('video-event', { activeTab: true });
