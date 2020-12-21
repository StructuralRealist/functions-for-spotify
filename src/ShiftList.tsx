import React from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import * as R from "ramda";
import random from "random-item";

import s from "./spotify";

const Title = styled.h2`
  text-align: center;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
`;

const Table = styled.table`
  table-layout: fixed;

  td {
    padding: 10px;
  }
`;

export default function ShiftList() {
  const history = useHistory();
  const { playlistId, userId } = useParams<{
    playlistId: string;
    userId: string;
  }>();
  const [playlist, setPlaylist] = React.useState<any>();
  const [tracks, setTracks] = React.useState<any[]>([]);
  const [albums, setAlbums] = React.useState<any[]>([]);
  const [shiftTracks, setShiftTracks] = React.useState<any[]>([]);
  const [playlistForm, setPlaylistForm] = React.useState({
    public: false,
    name: "",
  });

  // Load playlist and albums for each track
  React.useEffect(() => {
    (async () => {
      // Reset state
      setTracks([]);
      setAlbums([]);

      // Get the playlist details
      const playlist = await s.getPlaylist(playlistId);
      console.log("PLAYLIST", playlist);
      setPlaylist(playlist);

      // Get the tracks (in order)
      let results: any[] = [];
      for (let i = 0; i < Math.ceil(playlist.tracks.total / 100); i++) {
        const _tracks = await s.getPlaylistTracks(playlistId, {
          limit: 100,
          offset: i * 100,
        });
        console.log(`TRACKS [chunk ${i}]`, _tracks);
        setTracks(R.concat(R.__, _tracks.items));
        results = results.concat(_tracks.items);
      }

      const albumIds = R.flatten(results).map(
        R.path<any>(["track", "album", "id"])
      );

      // Get the album details (order not important)
      R.splitEvery(20, albumIds).map(async (chunck, index) => {
        const results = await s.getAlbums(chunck);
        console.log(`ALBUMS [chunk ${index}]`, results);
        setAlbums(R.concat(results.albums));
      });
    })();
  }, [playlistId]);

  // For each track in the playlist take another
  // one from the corresponding album.
  const generateShift = React.useCallback(() => {
    const newTracks = R.pipe(
      R.map(R.path(["track", "album", "id"])),
      R.map((id) => albums.find(R.whereEq({ id }))),
      R.map(R.pathOr([], ["tracks", "items"])),
      R.map(random)
    )(tracks);

    setShiftTracks(newTracks);
  }, [playlist, albums]);

  // Create playlist
  const createPlaylist = React.useCallback(async () => {
    const newPlaylist = await s.createPlaylist(userId, {
      name: playlistForm.name,
      public: playlistForm.public,
    });
    console.log("CREATE PLAYLIST", newPlaylist);
    const uriBatches = R.splitEvery(
      100,
      shiftTracks.map<string>(R.prop("uri"))
    );
    // Add tracks (in order)
    let i = 0;
    for await (let uris of uriBatches) {
      console.log(`ADD TRACKS [chunk ${i}]`, uris);
      await s.addTracksToPlaylist(newPlaylist.id, uris);
      i++;
    }

    alert("Your playlist has been created!");
    history.push(`/${userId}`);
  }, [shiftTracks, playlistForm]);

  return (
    <div>
      <Title>{`${playlist?.name ?? playlistId}`}</Title>
      <Buttons>
        <Link to={`/${userId}`}>Back</Link>
        <button onClick={generateShift}>Pivot!</button>
        {!R.isEmpty(shiftTracks) && (
          <>
            <input
              type="text"
              placeholder="Playlist name"
              value={playlistForm.name}
              onChange={(e) => setPlaylistForm(R.assoc("name", e.target.value))}
            />
            <label htmlFor="">
              <input
                type="checkbox"
                value="on"
                checked={playlistForm.public}
                onChange={() =>
                  setPlaylistForm(R.assoc("public", !playlistForm.public))
                }
              />
              {" Public"}
            </label>
            <button onClick={createPlaylist} disabled={!playlistForm.name}>
              Create playlist
            </button>
          </>
        )}
      </Buttons>

      <Table>
        <thead>
          <tr>
            <th>Tracks ({tracks.length})</th>
            <th>New tracks</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map(
            ({ track: { id, name, album, artists } }: any, index: number) => {
              const shiftedTrack = shiftTracks[index];

              return (
                <tr key={id}>
                  <td>
                    <strong>{artists.map(R.prop("name")).join(", ")}</strong>
                    {` - ${name}`}
                  </td>
                  {shiftedTrack ? (
                    <td>
                      <strong>
                        {shiftedTrack.artists.map(R.prop("name")).join(", ")}
                      </strong>
                      {` - ${shiftedTrack.name}`}
                    </td>
                  ) : (
                    <td>-</td>
                  )}
                </tr>
              );
            }
          )}
        </tbody>
      </Table>
    </div>
  );
}
