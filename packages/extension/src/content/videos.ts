const videos: HTMLVideoElement[] = [];

export const save = (video: HTMLVideoElement) => {
  videos.push(video);
};

export const isSaved = (video: HTMLVideoElement) => {
  return videos.includes(video);
};
