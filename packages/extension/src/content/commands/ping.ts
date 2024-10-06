import { createEventStream } from '../../lib/event-stream';

export const [subscribeToPing, sendPing] = createEventStream('ping');
