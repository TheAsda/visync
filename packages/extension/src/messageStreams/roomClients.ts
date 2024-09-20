import { createMessageStream } from '../lib/message-stream';

export const [roomClients$, sendRoomClients] =
  createMessageStream<string[]>('room-clients');
