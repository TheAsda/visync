import { createMessageStream } from '../lib/runtime';

export type ErrorMessage = {
  message: string;
  messageId: string;
};

export const [error$, sendError] = createMessageStream<ErrorMessage>('error');
