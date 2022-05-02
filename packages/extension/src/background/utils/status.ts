import { ClientStatus } from 'visync-contracts';
import { fetcher } from '../fetcher';

export const getClientStatus = (clientId: string): Promise<ClientStatus> => {
  return fetcher<ClientStatus>(`/client/${clientId}/status`);
};
