import { createEventStream } from '../lib/event-stream';

const [ping$, sendPing] = createEventStream<void>('ping');

const startPinging = () => {
  const interval = setInterval(() => {
    sendPing();
  }, 1000);
  return () => clearInterval(interval);
};

export { ping$, startPinging };
