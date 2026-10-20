import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	album: {
		artist: r.one.artist({
			from: r.album.artistId,
			to: r.artist.id
		}),
		tracks: r.many.track(),
	},
	artist: {
		albums: r.many.album(),
		member: r.one.member({
			from: r.artist.hauptmitglied,
			to: r.member.id
		}),
	},
	member: {
		artists: r.many.artist(),
	},
	track: {
		album: r.one.album({
			from: r.track.albumId,
			to: r.album.id
		}),
	},
}))