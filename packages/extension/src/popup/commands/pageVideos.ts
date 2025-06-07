import { createAsyncCommand } from '../../lib/asyncCommand';

export interface VideoInfo {
  id: string;
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
  id: string;
};

export const [dispatchVideoEvent, handleDispatchVideoEvent] =
  createAsyncCommand<VideoEvent>('video-event', { activeTab: true });

export const [getVideoInfo, handleGetVideoInfo] = createAsyncCommand<
  string,
  VideoInfo
>('video-update', { activeTab: true });

export const [startSyncVideo, handleStartSyncVideo] =
  createAsyncCommand<string>('start-sync-video', { activeTab: true });

export const [stopSyncVideo, handleStopSyncVideo] = createAsyncCommand<string>(
  'stop-sync-video',
  { activeTab: true }
);
