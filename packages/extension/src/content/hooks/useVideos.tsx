import { useEffect, useState } from 'react';

export const useVideos = () => {
  const [videos, setVideos] = useState<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const observer = new MutationObserver((e) => {
      const videos = Array.from(document.getElementsByTagName('video'));

      setVideos((s) => {
        const newVideos: HTMLVideoElement[] = [];

        videos.forEach((v) => {
          if (!s.includes(v)) {
            newVideos.push(v);
          }
        });

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

        if (removedVideoIndexes.length === 0) {
          return s;
        }
        return s.map((v, i) => (removedVideoIndexes.includes(i) ? null : v));
      });
    });
    observer.observe(document.body, { subtree: true, childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return videos;
};
