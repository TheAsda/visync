import { useEffect, useRef } from 'react';
import { logger } from '../../runtimeLogger';
import { RuntimeRequest } from '../../types/runtimeMessages';

const pingBackgroundScript = () => {
  const request: RuntimeRequest = {
    type: 'ping',
  };
  chrome.runtime.sendMessage(JSON.stringify(request));
};

const interval = 500;

export const usePing = (enabled: boolean) => {
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (enabled) {
      logger.debug('Start pinging');
      intervalRef.current = setInterval(
        pingBackgroundScript,
        interval
      ) as unknown as number;
    } else {
      logger.debug('Stop pinging');
      clearInterval(intervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [enabled]);
};
