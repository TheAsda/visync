import type { LogRequest } from 'visync-contracts';
import { getClientId } from './clientId';
import { fetcher } from './fetcher';

const disableLogDna = process.env.DISABLE_LOGDNA;
if (disableLogDna) {
  console.warn('LogDNA is disabled');
}

export const sendLogs = async (request: LogRequest) => {
  let consoleOut: typeof console.log;
  switch (request.level) {
    case 'fatal':
    case 'error':
      consoleOut = console.error;
      break;
    case 'warn':
      consoleOut = console.warn;
      break;
    case 'debug':
      consoleOut = console.debug;
      break;
    case 'trace':
      consoleOut = console.trace;
      break;

    default:
      consoleOut = console.log;
  }
  if (request.meta) {
    consoleOut(request.message, request.meta);
  } else {
    consoleOut(request.message);
  }

  if (disableLogDna) {
    return;
  }

  return fetcher('/log', {
    ...request,
    app: 'visync-extension',
    meta: {
      ...request.meta,
      clientId: await getClientId(),
    },
  });
};

const getLogger =
  (level: LogRequest['level']) => (message: string, meta?: any) => {
    return sendLogs({
      level,
      message,
      meta,
    });
  };

const logger = {
  trace: getLogger('trace'),
  debug: getLogger('debug'),
  info: getLogger('info'),
  warn: getLogger('warn'),
  error: getLogger('error'),
  fatal: getLogger('fatal'),
};

export { logger };
