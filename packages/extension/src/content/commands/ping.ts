import { createEventStream } from '../../lib/eventStream';

export const [subscribeToPing, sendPing] = createEventStream('ping');
