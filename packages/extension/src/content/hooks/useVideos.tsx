import { useEffect, useState } from 'react';

export const useVideos = () => {
  const [videos, setVideos] = useState<HTMLVideoElement[]>([]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const videos = Array.from(document.getElementsByTagName('video'));
      console.log(`Found ${videos.length} videos`);

      setVideos((s) => {
        let newVideos: HTMLVideoElement[] = [];

        videos.forEach((v) => {
          if (!s.includes(v)) {
            newVideos.push(v);
          }
        });
        console.log(`${newVideos.length} videos are new`);

        if (newVideos.length === 0) {
          return s;
        }
        return [...s, ...newVideos];
      });
    });
    observer.observe(document.body, { subtree: true, childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return videos;
};
