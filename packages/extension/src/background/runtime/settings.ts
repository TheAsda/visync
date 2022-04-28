import { RuntimeResponse } from '../../types/runtimeMessages';
import { getSettings, setSettings } from '../settings';
import { sendResponseToTabs } from '../utils/tabs';
import { RuntimeRequestHandler } from './runtimeRequestHandler';

export const settingsRequestHandler: RuntimeRequestHandler = async (
  clientId,
  request,
  sender,
  sendResponse
) => {
  switch (request.type) {
    case 'settings': {
      const settings = await getSettings();
      const response: RuntimeResponse = {
        type: 'settings',
        payload: settings,
      };
      sendResponse(JSON.stringify(response));
      break;
    }

    case 'update-settings': {
      setSettings(request.payload);
      const response: RuntimeResponse = {
        type: 'settings',
        payload: request.payload,
      };
      sendResponseToTabs(response);
      sendResponse(JSON.stringify(response));
      break;
    }
  }
};
