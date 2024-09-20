import { createAsyncCommand } from '../lib/async-message';

export const [getClientId, handleClientId] = createAsyncCommand<void, string>(
  'client-id'
);
