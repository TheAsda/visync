import { createMessageStream } from '../lib/message-stream';

const [ping$, sendPing] = createMessageStream<void>('ping');

const startPinging = () => {
  const interval = setInterval(() => {
    sendPing();
  }, 1000);
  return () => clearInterval(interval);
};

export { ping$, startPinging };
