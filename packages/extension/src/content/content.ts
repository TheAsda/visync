import { watchMutation } from './observer';
import { attachSyncer } from './syncing';
import { isSaved, save } from './videos';

watchMutation(() => {
  const pageVideos = Array.from(document.getElementsByTagName('video'));
  console.log(`Fount ${pageVideos.length} videos`);
  for (const video of pageVideos) {
    if (isSaved(video)) {
      continue;
    }
    save(video);
    console.log('Attaching');

    attachSyncer(video);
  }
});
