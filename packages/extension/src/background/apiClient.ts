import { treaty } from '@elysiajs/eden';
import type { Server } from '../../../server/src/server';

export const apiClient = treaty<Server>(
  process.env.SERVER_URL ?? 'http://localhost:23778',
  {
    keepDomain: true,
  }
);
