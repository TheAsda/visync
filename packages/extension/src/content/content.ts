import { sendVideos, videos$ } from '../messageStreams/video';
import { VideoDetector } from './videoDetector';

const videoDetector = new VideoDetector();

const observer = new MutationObserver(() => {
  videoDetector.updateVideos();
});

observer.observe(document.body, { subtree: true });

sendVideos(videoDetector.videos);
