import logdna from '@logdna/logger';

const logger = logdna.createLogger(process.env['LOGDNA_INGESTION_KEY']!, {
  app: 'syncboii-server',
  level: 'debug',
});

const disableLogDna = Boolean(process.env['DISABLE_LOGDNA']);
if (disableLogDna) {
  console.warn('LogDNA is disabled');
}

logger.log = (statement, options) => {
  console.log(statement);
  if (disableLogDna) {
    return;
  }
  logger.log.bind(logger)(statement, options);
};

export { logger };
