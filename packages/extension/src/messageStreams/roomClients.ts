import { createEventStream } from '../lib/event-stream';

export const [roomClients$, sendRoomClients] =
  createEventStream<string[]>('room-clients');
