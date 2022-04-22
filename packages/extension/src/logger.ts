import logdna from '@logdna/browser';

const logger = logdna.init(process.env['LOGDNA_INGESTION_KEY']!, {
  app: 'syncboii-extension',
  debug: true,
});

const disableLogDna = Boolean(process.env['DISABLE_LOGDNA']);
if (disableLogDna) {
  console.warn('LogDNA is disabled');
}

// @ts-ignore
logger.log = (statement, options, level) => {
  let consoleOut: typeof console.log;
  switch (level) {
    case 'error':
      consoleOut = console.error;
      break;
    case 'warn':
      consoleOut = console.warn;
      break;
    case 'debug':
      consoleOut = console.debug;
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
