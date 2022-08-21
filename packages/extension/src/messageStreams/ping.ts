import { createMessageStream } from '../lib/runtime';

const [ping$, sendPing] = createMessageStream<void>('ping');

const startPinging = () => {
  const interval = setInterval(() => {
    sendPing();
  }, 1000);
  return () => clearInterval(interval);
};

export { ping$, startPinging };
