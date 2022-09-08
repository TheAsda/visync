import { Knex } from 'knex';
import { Client } from '../knex.js';

export const clientExists = async (knex: Knex, clientId: string) => {
  return !!(await knex
    .table<Client>('client')
    .where('clientId', clientId)
    .first());
};
