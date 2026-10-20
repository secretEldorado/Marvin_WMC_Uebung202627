// demo.ts — Drizzle ORM am Musik-Katalog: Lesen, Schreiben, Auswerten.
// Zeigt zu jeder Query das erzeugte SQL (toSQL()) — ein ORM ersetzt SQL
// nicht, es erzeugt es. Laufen mit:  deno task demo
import { and,lte, count, desc, eq, like, sql} from "drizzle-orm";
import { oeffneDb } from "./db.ts";
import { album, artist, track, member } from "./schema.ts";
// import { migrate } from 'drizzle-orm/node-sqlite/migrator';
// import { fileURLToPath } from 'node:url';

// Datei-DB im Projektordner — bei jedem Lauf neu anlegen.
await Deno.remove("musik.db").catch(() => {/* Datei fehlt: egal */});
const db = oeffneDb("musik.db");
// const migrationsFolder = 
//   fileURLToPath(new URL('./drizzle/20261020174547_migrationtool', import.meta.url));
//   migrate(db, { migrationsFolder });
// --- Schreiben: insert mit .returning() ------------------------------
const michael = await db.insert(member)
  .values({ vorname: "Michael", alias: "Silent One", birthday: sql`date('1980-03-20')`})
  .returning();
// const sarah = await db.insert(member)
//   .values({ vorname: "Sarah", alias: "Dark Diva", birthday: sql`date('1987-08-11')`})
//   .returning();
const connor = await db.insert(member)
  .values({ vorname: "Connor", alias: "Drumboy", birthday: sql`date('1990-11-30')`})
  .returning();
const aera = await db.insert(artist)
  .values({ name: "Aera", gruendungsjahr: 1999, hauptmitglied: michael[0].id })
  .returning();
const nova = await db.insert(artist)
  .values({ name: "Nova", gruendungsjahr: 2012, hauptmitglied: connor[0].id})
  .returning();
const stille = await db.insert(album)
  .values({ titel: "Silent Lines", jahr: 2015, artistId: aera[0].id })
  .returning();
const night = await db.insert(album)
  .values({ titel: "Night Ferry", jahr: 2012, artistId: nova[0].id })
  .returning();
await db.insert(track)
  .values({ titel: "Silent Lines", dauerSek: 215, albumId: stille[0].id });
await db.insert(track)
  .values({ titel: "Echo Room", dauerSek: 187, albumId: stille[0].id });
await db.insert(track)
  .values({ titel: "Night Ferry", dauerSek: 220, albumId: night[0].id });
await db.insert(track)
  .values({ titel: "Soul Reaper", dauerSek: 191, albumId: night[0].id });

// --- Lesen: select .from() .where() ----------------------------------
const fragen = db.select().from(album).where(eq(album.artistId, aera[0].id));
console.log("Lesen, erzeugtes SQL:", fragen.toSQL().sql);
console.log("Lesen, Parameter:", fragen.toSQL().params);
console.log("Lesen, Ergebnis:", await fragen);

// --- Auswerten: orderBy, limit, count --------------------------------
const neueste = await db.select().from(album).orderBy(desc(album.jahr)).limit(
  1,
);
console.log("Neuestes Album:", neueste[0].titel, "(", neueste[0].jahr, ")");

const viele = await db.select({ titel: album.titel, tracks: count() })
  .from(track)
  .innerJoin(album, eq(track.albumId, album.id))
  .groupBy(album.id);
console.log("Tracks pro Album:", viele);

// --- Ändern: update .set() .where() ----------------------------------
await db.update(track)
  .set({ dauerSek: 220 })
  .where(and(eq(track.albumId, stille[0].id), like(track.titel, "Silent%")));
const korrigiert = await db.select().from(track)
  .where(eq(track.titel, "Silent Lines"));
await db.update(track)
  .set({ dauerSek: 201 })
  .where(and(eq(track.albumId, night[0].id), lte(track.dauerSek, 200)))
const korr = await db.select().from(track)
  .where(eq(track.dauerSek, 201))
console.log("Nach update:", korrigiert[0].dauerSek, "Sekunden");
console.log("Nach update Titel:", korr[0].titel);

// --- Löschen: delete .where() ----------------------------------------
await db.delete(track).where(eq(track.titel, "Echo Room"));
// 1 track deleted
await db.delete(track).where(eq(track.titel, "Night Ferry"));
// 1 track deleted
const rest = await db.select({ anzahl: count() }).from(track);
console.log("Tracks nach delete:", rest[0].anzahl);

//https://www.liquibase.com/resources/guides/database-schema-migration
//the whole schema can be changed with schema migration tools.
//the relational database structures changes through this by adding tables, 
// deleting columns, etc.
//with drizzle-kit we can generate SQL migration files and apply the changes to 
//our own database or we can look the schema directly from the database
// 'npm i -D drizzle-kit' to install the kit with  'npm i drizzle-orm@rc' for the upgrade
db.$client.close();
