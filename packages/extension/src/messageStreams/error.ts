import { createMessageStream } from '../lib/message-stream';

export type ErrorMessage = {
  message: string;
  messageId: string;
};

export const [error$, sendError] = createMessageStream<ErrorMessage>('error');
