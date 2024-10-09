import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import useSWRSubscription from 'swr/subscription';
import { getVideoInfo, VideoInfo as VInfo } from '../commands/pageVideos';
import { formatDuration } from '../lib/duration';
import { Video } from '../lib/video';
import './VideoInfo.css';

export interface VideoInfoProps {
  video: Video;
}

export const VideoInfo = (props: VideoInfoProps) => {
  const { video } = props;

  const { data: currentVideo } = useSWR(
    ['video', video.info.id],
    () => video.getInfo(),
    { fallbackData: video.info, refreshInterval: 1000 }
  );

  const { trigger: startSync, isMutating: isStarting } = useSWRMutation(
    ['video', video.info.id],
    () => video.startSync()
  );
  const { trigger: stopSync, isMutating: isStopping } = useSWRMutation(
    ['video', video.info.id],
    () => video.stopSync()
  );

  const toggleSync = () => {
    if (currentVideo?.isSynced) {
      stopSync();
    } else {
      startSync();
    }
  };

  return (
    <li
      className="video-info"
      onMouseEnter={() => video.highlight()}
      onMouseLeave={() => video.unhighlight()}
    >
      <div className="video-info__id">{video.info.title ?? video.info.id}</div>
      <div className="video-info__duration">{`${formatDuration(currentVideo?.currentTime)}/${formatDuration(currentVideo?.duration)}`}</div>
      <div className="video-info__play-speed">({currentVideo?.playSpeed}x)</div>
      <button
        className="video-info__sync-button focusable"
        onClick={toggleSync}
        disabled={isStarting || isStopping}
        aria-busy={isStarting || isStopping}
      >
        {!currentVideo?.isSynced ? 'Sync' : 'Unsync'}
      </button>
    </li>
  );
};
