import { useMemo } from 'react';
import useSWR from 'swr';
import { getPageVideos } from '../commands/pageVideos';
import { Video } from '../lib/video';
import { VideoInfo } from './VideoInfo';
import './VideoSelector.css';

export const VideoSelector = () => {
  const { data, isLoading } = useSWR('page-videos', () => getPageVideos());
  const videos = useMemo(
    () => data?.map((info) => new Video(info)) ?? [],
    [data]
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="video-selector">
      <h2 className="video-selector__title">Videos</h2>
      <ol className="video-selector__list">
        {videos.map((video) => (
          <VideoInfo video={video} key={video.info.id} />
        ))}
      </ol>
    </div>
  );
};
