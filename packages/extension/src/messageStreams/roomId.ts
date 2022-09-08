import { createMessageStream } from '../lib/runtime';

export const [roomId$, sendRoomId] = createMessageStream<string | undefined>(
  'room-id'
);
