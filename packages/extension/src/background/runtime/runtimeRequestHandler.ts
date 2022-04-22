import { RuntimeRequest } from '../../types/runtimeMessages';

export type RuntimeRequestHandler = (
  clientId: string,
  request: RuntimeRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: string) => void
) => Promise<void>;
