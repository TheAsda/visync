import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { clients, roomsRelations, rooms, clientsRelations } from './schema.js';

const sqlite = new Database(':memory:');
const db = drizzle(sqlite, {
  schema: { clients, rooms, clientsRelations, roomsRelations },
});

migrate(db, { migrationsFolder: './drizzle' });

export default db;
