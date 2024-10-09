import { createAsyncCommand } from '../../lib/asyncCommand';

export const [getClientId, handleClientId] = createAsyncCommand<void, string>(
  'client-id'
);
