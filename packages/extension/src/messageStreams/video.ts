import { createAsyncCommand } from '../lib/async-command';
import { createMessageStream } from '../lib/message-stream';

export interface Video {}

export const [subscribeToPageVideos, sendPageVideos, onVideoSubscription] =
  createMessageStream<Video[]>('page-videos');
