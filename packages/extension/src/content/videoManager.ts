import type { VideoInfo } from '../popup/commands/pageVideos';

export interface VideoManager {
  id: string;
  highlight(): void;
  unhighlight(): void;
  getInfo(): Promise<VideoInfo>;
  startSync(): Promise<void>;
  stopSync(): Promise<void>;
}
