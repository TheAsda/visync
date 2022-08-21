import { createMessageStream } from '../lib/runtime';

export const [clientId$, sendClientId] =
  createMessageStream<string>('clientId');
