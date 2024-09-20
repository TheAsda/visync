import useSWRSubscription from 'swr/subscription';
import { subscribeToPageVideos, Video } from '../../messageStreams/video';

export const VideoSelector = () => {
  const { data } = useSWRSubscription<Video[], unknown, 'page-videos'>(
    'page-videos',
    (_, { next }) => {
      return subscribeToPageVideos((videos) => next(null, videos));
    }
  );

  return <ul>{data?.map((_, i) => <li key={i}>{i}</li>)}</ul>;
};
