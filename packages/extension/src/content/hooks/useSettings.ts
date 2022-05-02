import { useEffect, useState } from 'react';
import { logger } from '../../runtimeLogger';
import { RuntimeRequest, RuntimeResponse } from '../../types/runtimeMessages';
import { ClientSettings } from '../../types/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<ClientSettings>();

  useEffect(() => {
    const runtimeMessageListener = (data: string) => {
      const response = JSON.parse(data) as RuntimeResponse;

      if (response.type !== 'settings') {
        return;
      }

      logger.debug(`Updating settings: ${JSON.stringify(response.payload)}`);
      setSettings(response.payload);
    };

    chrome.runtime.onMessage.addListener(runtimeMessageListener);
    const request: RuntimeRequest = {
      type: 'settings',
    };
    chrome.runtime.sendMessage(JSON.stringify(request), (data) => {
      const response = JSON.parse(data) as RuntimeResponse;

      if (response.type !== 'settings') {
        return;
      }

      setSettings(response.payload);
    });

    return () => {
      chrome.runtime.onMessage.removeListener(runtimeMessageListener);
    };
  }, []);

  return { settings, isLoading: settings === undefined };
};
