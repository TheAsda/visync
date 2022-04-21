import logdna, { Logger } from '@logdna/logger';

const logger = logdna.createLogger(process.env['LOGDNA_INGESTION_KEY']!, {
  app: 'syncboii-server',
  level: 'debug',
}) as Required<Logger>;

const disableLogDna = Boolean(process.env['DISABLE_LOGDNA']);
if (disableLogDna) {
  console.warn('LogDNA is disabled');
}

logger.log = (statement, options) => {
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
  consoleOut(statement);
  if (disableLogDna) {
    return;
  }
  logger.log.bind(logger)(statement, options);
};

export { logger };
