import { useEffect, useState } from 'react';
import { logger } from '../../runtimeLogger';
import { RuntimeRequest, RuntimeResponse } from '../../types/runtimeMessages';

export const useCanSync = () => {
  const [canSync, setCanSync] = useState(false);

  useEffect(() => {
    const handleStatus = async (data: string) => {
      const message = JSON.parse(data) as RuntimeResponse;
      if (message.type !== 'status') {
        return;
      }
      const canSync =
        message.payload.room !== undefined &&
        (!message.payload.isSynced || !!message.payload.tabIsSynced);
      logger.debug(`Updating canSync: ${canSync}`);
      setCanSync(canSync);
    };

    chrome.runtime.onMessage.addListener(handleStatus);
    const request: RuntimeRequest = {
      type: 'status',
    };
    chrome.runtime.sendMessage(JSON.stringify(request), handleStatus);

    return () => {
      chrome.runtime.onMessage.removeListener(handleStatus);
    };
  }, []);

  return canSync;
};
