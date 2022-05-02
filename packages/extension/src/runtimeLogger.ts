import { LogRequest } from 'visync-contracts';
import { RuntimeRequest } from './types/runtimeMessages';

const getLog =
  (level: LogRequest['level']) => (message: string, meta?: any) => {
    const request: RuntimeRequest = {
      type: 'log',
      payload: {
        level,
        message,
        meta: {
          ...meta,
          script: 'process.env.SCRIPT',
        },
      },
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  };

export const logger = {
  trace: getLog('trace'),
  debug: getLog('debug'),
  info: getLog('info'),
  warn: getLog('warn'),
  error: getLog('error'),
  fatal: getLog('fatal'),
};
