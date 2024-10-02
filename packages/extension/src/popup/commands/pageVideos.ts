import { createAsyncCommand } from '../../lib/async-command';

export interface VideoInfo {
  id: number;
  title: string;
  currentTime: number;
  duration: number;
  playSpeed: number;
  isPlaying: boolean;
  isSynced: boolean;
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

export const [getVideoInfo, onGetVideoInfo] = createAsyncCommand<
  { videoId: number },
  VideoInfo
>('video-update', { activeTab: true });

export const [startSyncVideo, handleStartSyncVideo] =
  createAsyncCommand<number>('start-sync-video', { activeTab: true });

export const [stopSyncVideo, handleStopSyncVideo] = createAsyncCommand<number>(
  'stop-sync-video',
  { activeTab: true }
);
