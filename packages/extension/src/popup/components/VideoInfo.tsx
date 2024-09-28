import useSWRSubscription from 'swr/subscription';
import { formatDuration } from '../lib/duration';
import { Video } from '../lib/video';
import { Button } from './Button';
import './VideoInfo.css';

export interface VideoInfo {
  video: Video;
}

export const VideoInfo = (props: VideoInfo) => {
  const { video } = props;

  const { data: currentTime } = useSWRSubscription<number>(
    ['currentTime', video.info.id],
    (key: string, { next }: { next: (err: null, time: number) => void }) => {
      return video.subscribeToDurationChange((time) => {
        next(null, time);
      });
    },
    { fallbackData: video.info.currentTime }
  );

  return (
    <li
      className="video-info"
      onMouseEnter={() => video.highlight()}
      onMouseLeave={() => video.unhighlight()}
    >
      <div className="video-info__id">{video.info.title ?? video.info.id}</div>
      <div className="video-info__duration">{`${formatDuration(currentTime)}/${formatDuration(video.info.duration)}`}</div>
      <div className="video-info__play-speed">({video.info.playSpeed}x)</div>
      <button className="video-info__sync-button focusable">Sync</button>
    </li>
  );
};
