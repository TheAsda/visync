import { logger } from '../logger';
import { RuntimeRequest } from '../types/runtimeMessages';
import { getClientId } from './clientId';
import { roomRequestHandler } from './runtime/room';
import { statusRequestHandler } from './runtime/status';
import { syncRequestHandler } from './runtime/sync';

const handlers = [
  roomRequestHandler,
  syncRequestHandler,
  syncRequestHandler,
  statusRequestHandler,
];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const request = JSON.parse(message) as RuntimeRequest;
  logger.info(`Runtime request starting ${request.type}`);

  getClientId().then(async (clientId) => {
    try {
      for (const handler of handlers) {
        await handler(clientId, request, sender, sendResponse);
      }
    } catch (err) {
      if (err instanceof Error) {
        logger.error(err.message);
      } else {
        logger.error(`Unknown error occurred: ${err}`);
      }
    }
    logger.info(`Runtime request finished ${request.type}`);
  });

  return true;
});
