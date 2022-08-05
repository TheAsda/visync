import { RuntimeRequest } from '../../types/runtimeMessages';

export type RuntimeRequestHandler = (
  request: RuntimeRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: string) => void
) => Promise<void>;
