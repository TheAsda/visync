import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const rooms = sqliteTable('room', {
  roomId: text('roomId').notNull().primaryKey(),
  link: text('link'),
});
export type Room = typeof rooms.$inferSelect;

export const clients = sqliteTable('client', {
  clientId: text('clientId').notNull().primaryKey(),
  roomId: text('roomId'),
});
export type Client = typeof clients.$inferSelect;

export const clientsRelations = relations(clients, ({ one }) => ({
  room: one(rooms, {
    fields: [clients.roomId],
    references: [rooms.roomId],
  }),
}));

export const roomsRelations = relations(rooms, ({ many }) => ({
  clients: many(clients),
}));
