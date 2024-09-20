export class VideoDetector {
  videos: HTMLVideoElement[] = [];

  constructor() {
    this.videos = [];
    this.updateVideos();
  }

  updateVideos() {
    this.videos = Array.from(document.querySelectorAll('video'));
  }
}
