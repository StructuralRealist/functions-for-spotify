import * as R from "ramda";

import s from "./spotify";
import random from "random-item";

interface PlaylistOptions {
  userId: string;
  playlistName: string;
  playlistPublic: boolean;
}

export async function sameAlbum(
  playlistId: string,
  { userId, playlistName, playlistPublic }: PlaylistOptions
) {
  const playlist = await s.getPlaylist(playlistId);
  console.log("PLAYLIST", playlist);

  // Get the tracks
  let tracks: any[] = [];
  for (let i = 0; i < Math.ceil(playlist.tracks.total / 100); i++) {
    const results = await s.getPlaylistTracks(playlistId, {
      limit: 100,
      offset: i * 100,
    });
    console.log(`TRACKS [chunk ${i}]`, results);
    tracks = tracks.concat(results.items);
  }

  // get album details
  const albumIds = R.flatten(tracks).map(
    R.path<any>(["track", "album", "id"])
  );

  let albums: any[] = [];
  for await (const batch of R.splitEvery(20, albumIds)) {
    const results = await s.getAlbums(batch);
    console.log(`ALBUMS [chunk]`, results);
    albums = albums.concat(results.albums);
  }

  const newTracks = R.pipe(
    R.map(R.path(["track", "album", "id"])),
    R.map((id) => albums.find(R.whereEq({ id }))),
    R.map(R.pathOr([], ["tracks", "items"])),
    R.map(R.reject(({ id }) => tracks.some(R.pathEq(["track", "id"], id)))),
    R.reject(R.isEmpty),
    R.map(random)
  )(tracks);

  const newPlaylist = await s.createPlaylist(userId, {
    name: playlistName,
    public: playlistPublic,
  });
  console.log("CREATE PLAYLIST", newPlaylist);
  const uriBatches = R.splitEvery(
    100,
    newTracks.map<string>(R.prop<string, any>("uri"))
  );
  // Add tracks (in order)
  let i = 0;
  for await (let uris of uriBatches) {
    console.log(`ADD TRACKS [chunk ${i}]`, uris);
    await s.addTracksToPlaylist(newPlaylist.id, uris);
    i++;
  }
}
