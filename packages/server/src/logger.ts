import { createLogger, format } from 'winston';
import { Console } from 'winston/lib/winston/transports';

export const logger = createLogger({
  level: 'info',
  transports: [
    new Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(
          ({ timestamp, level, message }) =>
            `${timestamp} [${level}]: ${message}`
        )
      ),
    }),
  ],
});
