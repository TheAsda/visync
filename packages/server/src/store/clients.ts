import { logger as defaultLogger } from '../logger';

const logger = defaultLogger.child({
  store: 'clients',
});

type Client = {
  clientId: string;
};

const clients: Client[] = [];

export const findClient = (clientId: string): Client | undefined => {
  return clients.find((client) => client.clientId === clientId);
};

export const registerClient = (clientId: string): Client => {
  logger.debug(`Registering client ${clientId}`);
  const client: Client = { clientId };
  clients.push(client);
  logger.debug(`Client ${clientId} registered`);
  return client;
};

