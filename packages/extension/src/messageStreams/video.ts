import { createMessageStream } from '../lib/runtime';

export interface Video {}

export const [videos$, sendVideos] = createMessageStream<Video[]>('videos');
