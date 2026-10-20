import { sqliteTable, foreignKey, unique, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const album = sqliteTable("album", {
	id: integer().primaryKey({ autoIncrement: true }),
	titel: text().notNull(),
	jahr: integer(),
	artistId: integer("artist_id").notNull().references(() => artist.id),
});

export const artist = sqliteTable("artist", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	gruendungsjahr: integer(),
	hauptmitglied: integer().references(() => member.id),
});

export const member = sqliteTable("member", {
	id: integer().primaryKey({ autoIncrement: true }),
	vorname: text().notNull(),
	alias: text().notNull(),
	birthday: text(),
},
(table) => [unique("member_alias_unique").on(table.alias),
]);

export const track = sqliteTable("track", {
	id: integer().primaryKey({ autoIncrement: true }),
	titel: text().notNull(),
	dauerSek: integer("dauer_sek").notNull(),
	albumId: integer("album_id").notNull().references(() => album.id),
});

