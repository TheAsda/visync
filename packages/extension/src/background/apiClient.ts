import { treaty } from '@elysiajs/eden';
import type { Server } from '../../../server/src/server';

export const apiClient = treaty<Server>('http://95.165.104.170:7001',{
  keepDomain: true
});
