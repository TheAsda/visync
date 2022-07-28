import { createLogger } from 'winston';
import { Console } from 'winston/lib/winston/transports';

export const logger = createLogger({
  level: 'info',
  transports: [new Console()],
});
