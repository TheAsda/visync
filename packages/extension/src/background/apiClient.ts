import { treaty } from '@elysiajs/eden';
import type { Server } from '../../../server/src/server';

export const apiClient = treaty<Server>('localhost:7001');
