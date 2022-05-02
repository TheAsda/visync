import { sendLogs } from '../logger';
import { RuntimeRequestHandler } from './runtimeRequestHandler';

export const logRequestHandler: RuntimeRequestHandler = async (
  clientId,
  request,
  sender,
  sendResponse
) => {
  if (request.type !== 'log') {
    return;
  }

  await sendLogs({
    ...request.payload,
    app: request.payload.app ?? 'visync-extension',
    meta: { ...request.payload.meta, clientId: clientId },
  });
  sendResponse();
};
