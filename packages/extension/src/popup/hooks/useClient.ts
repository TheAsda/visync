import { useEffect, useState } from 'react';
import { RuntimeResponse, RuntimeRequest } from '../../types/runtimeMessages';

export const useClient = () => {
  const [clientId, setClientId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const request: RuntimeRequest = {
      type: 'get-client',
    };
    chrome.runtime.sendMessage(JSON.stringify(request), (data) => {
      const message = JSON.parse(data) as RuntimeResponse;

      if (message.type === 'client') {
        setClientId(message.payload.clientId);
        setIsLoading(false);
      }
    });
  }, []);

  return {
    clientId,
    isLoading,
  };
};