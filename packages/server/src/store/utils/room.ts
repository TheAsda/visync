import { Knex } from 'knex';
import { Room } from '../knex.js';

export const roomExists = async (knex: Knex, roomId: string) => {
  return !!(await knex.table<Room>('room').where('roomId', roomId).first());
};
