import { createAsyncCommand } from '../lib/async-command';

export const [getClientId, handleClientId] = createAsyncCommand<void, string>(
  'client-id'
);
