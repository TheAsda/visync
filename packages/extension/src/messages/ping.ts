import { getMessage } from '@extend-chrome/messages';

export const [sendPing, pingStream, waitForPing] = getMessage<void>('ping');

export const startPinging = () => {
  const interval = setInterval(() => {
    sendPing();
  }, 1000);
  return () => clearInterval(interval);
};
