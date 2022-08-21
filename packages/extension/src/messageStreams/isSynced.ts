import { createMessageStream } from '../lib/runtime';

export const [isSynced$, sendIsSynced] =
  createMessageStream<boolean>('isSynced');
