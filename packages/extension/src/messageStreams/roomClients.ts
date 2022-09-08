import { createMessageStream } from '../lib/runtime';

export const [roomClients$, sendRoomClients] =
  createMessageStream<string[]>('room-clients');
