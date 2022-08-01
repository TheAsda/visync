import {
  RuntimeRequest,
  RuntimeResponse,
} from '../../../types/runtimeMessages';

export const sendMessage = (
  request: RuntimeRequest
): Promise<RuntimeResponse> => {
  return chrome.runtime.sendMessage(JSON.stringify(request)).then((message) => {
    return JSON.parse(message);
  });
};
