import { useMemo } from 'react';
import useSWR from 'swr';
import { dispatchVideoEvent, getPageVideos } from '../commands/pageVideos';
import { Video } from '../lib/video';

export const VideoSelector = () => {
  const { data, isLoading } = useSWR('page-videos', () => getPageVideos());
  const videos = useMemo(() => data?.map((_, i) => new Video(i)) ?? [], [data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="video-selector">
      <h2 className="video-selector__title">Videos</h2>
      <ol className="video-selector__list">
        {videos.map((video) => (
          <li
            key={video.index}
            className="video-selector__item"
            onMouseEnter={() => {
              video.highlight();
            }}
            onMouseLeave={() => {
              video.unhighlight();
            }}
          >
            {video.index}
          </li>
        ))}
      </ol>
    </div>
  );
};
