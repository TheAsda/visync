import logdna from '@logdna/logger';

const logger = logdna.createLogger(process.env['LOGDNA_INGESTION_KEY']!, {
  app: 'syncboii-server',
  level: 'debug',
});

export { logger };
