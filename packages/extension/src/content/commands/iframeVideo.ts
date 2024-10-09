import { createWindowCommand } from '../../lib/windowCommand';
import { VideoInfo, VideoEvent } from '../../popup/commands/pageVideos';

export const [getIframeVideos, handleGetIframeVideos] = createWindowCommand<
  void,
  VideoInfo[]
>('iframe-video');
export const [dispatchIframeVideoEvent, handleIframeDispatchVideoEvent] =
  createWindowCommand<VideoEvent>('iframe-video-event');
export const [getIframeVideoInfo, handleGetIframeVideoInfo] =
  createWindowCommand<string, VideoInfo>('iframe-video-info');
export const [startIframeSync, handleStartIframeSync] =
  createWindowCommand<string>('iframe-start-sync');
export const [stopIframeSync, handleStopIframeSync] =
  createWindowCommand<string>('iframe-stop-sync');
