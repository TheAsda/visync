import { useEffect, useState } from 'react';
import { logger } from '../../runtimeLogger';

export const useVideos = () => {
  const [videos, setVideos] = useState<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const observer = new MutationObserver((e) => {
      const videos = Array.from(document.getElementsByTagName('video'));
      logger.debug(`Found ${videos}`);

      setVideos((s) => {
        const newVideos: HTMLVideoElement[] = [];

        videos.forEach((v) => {
          if (!s.includes(v)) {
            newVideos.push(v);
          }
        });
        logger.debug(`${newVideos.length} videos are new`);

        if (newVideos.length === 0) {
          return s;
        }
        return [...s, ...newVideos];
      });

      const removedNodes = Array.from(e[0].removedNodes);

      setVideos((s) => {
        const removedVideoIndexes: number[] = [];

        s.forEach((v, i) => {
          if (removedNodes.find((node) => node.contains(v)) !== undefined) {
            removedVideoIndexes.push(i);
          }
        });
        logger.debug(`${removedVideoIndexes.length} videos are removed`);

        if (removedVideoIndexes.length === 0) {
          return s;
        }
        return s.map((v, i) => (removedVideoIndexes.includes(i) ? null : v));
      });
    });
    logger.debug('Start observing body');
    observer.observe(document.body, { subtree: true, childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return videos;
};
