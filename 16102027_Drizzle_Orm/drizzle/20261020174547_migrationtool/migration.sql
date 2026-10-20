CREATE TABLE IF NOT EXISTS `album` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`titel` text NOT NULL,
	`jahr` integer,
	`artist_id` integer NOT NULL,
	CONSTRAINT `fk_album_artist_id_artist_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artist`(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `artist` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`gruendungsjahr` integer,
	`hauptmitglied` integer,
	CONSTRAINT `fk_artist_hauptmitglied_member_id_fk` FOREIGN KEY (`hauptmitglied`) REFERENCES `member`(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `member` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`vorname` text NOT NULL,
	`alias` text NOT NULL UNIQUE,
	`birthday` text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `track` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`titel` text NOT NULL,
	`dauer_sek` integer NOT NULL,
	`album_id` integer NOT NULL,
	CONSTRAINT `fk_track_album_id_album_id_fk` FOREIGN KEY (`album_id`) REFERENCES `album`(`id`)
);
