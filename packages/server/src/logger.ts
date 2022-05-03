import logdna, { Logger } from '@logdna/logger';

const logger = logdna.createLogger(process.env['LOGDNA_INGESTION_KEY']!, {
  app: 'visync-server',
  level: 'debug',
}) as Required<Logger>;

const disableLogDna = Boolean(process.env['DISABLE_LOGDNA']);
if (disableLogDna) {
  console.warn('LogDNA is disabled');
}

logger.log = (statement, options) => {
  logToConsole(statement, options);
  if (disableLogDna) {
    return;
  }
  logger.log.bind(logger)(statement, options);
};

const logToConsole = (statement: any, options?: logdna.LogOptions) => {
  let consoleOut: typeof console.log;
  switch (options?.level) {
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
  const log = `[${new Date().toISOString()}] ${
    options?.app ? `[${options.app}] ` : ''
  }${statement}${options?.meta ? ' ' + JSON.stringify(options.meta) : ''}`;
  consoleOut(log);
};

export { logger };
