import { useEffect, useState } from 'react';
import { RuntimeRequest, RuntimeResponse } from '../../types/runtimeMessages';
import { ClientSettings } from '../../types/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<ClientSettings>();

  useEffect(() => {
    chrome.runtime.onMessage.addListener((data) => {
      const response = JSON.parse(data) as RuntimeResponse;

      if (response.type !== 'settings') {
        return;
      }

      setSettings(response.payload);
    });
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
  }, []);

  return { settings, isLoading: settings === undefined };
};
