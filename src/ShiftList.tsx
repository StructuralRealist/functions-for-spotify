import React from "react";
import { useParams, Link } from "react-router-dom";
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
  const { playlistId, userId } = useParams<{
    playlistId: string;
    userId: string;
  }>();
  const [playlist, setPlaylist] = React.useState<any>();
  const [albums, setAlbums] = React.useState<any[]>([]);
  const [shiftTracks, setShiftTracks] = React.useState<any[]>([]);

  // Load playlist and albums for each track
  React.useEffect(() => {
    (async () => {
      const playlist = await s.getPlaylist(playlistId);
      console.log("PLAYLIST", playlist);
      setPlaylist(playlist);

      const albumIds = playlist.tracks.items.map(
        R.path<any>(["track", "album", "id"])
      );

      // Spotify only allows 20 ids per call
      R.splitEvery(20, albumIds).map(async (chunck, index) => {
        const results = await s.getAlbums(chunck);
        console.log(`ALBUMS [chunck ${index}]`, results);
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
    )(playlist.tracks.items);

    setShiftTracks(newTracks);
  }, [playlist, albums]);

  // Create playlist
  const createPlaylist = React.useCallback(async () => {
    s.createPlaylist(userId, {});
  }, [shiftTracks]);

  return (
    <div>
      <Title>{`${playlist?.name ?? playlistId}`}</Title>
      <Buttons>
        <Link to="/">Back</Link>
        <button onClick={generateShift}>SHIFT!</button>
      </Buttons>

      <Table>
        <thead>
          <tr>
            <th>Track</th>
            <th>Shifted track</th>
            <th>Album</th>
          </tr>
        </thead>
        <tbody>
          {playlist?.tracks.items.map(
            ({ track: { id, name, album, artists } }: any, index: number) => {
              const shiftedTrack = shiftTracks[index];
              console.log(shiftedTrack);

              return (
                <tr key={id}>
                  <td>
                    <strong>{artists.map(R.prop("name")).join(", ")}</strong>
                    {` - ${name}`}
                  </td>
                  {shiftedTrack && (
                    <td>
                      <strong>
                        {shiftedTrack.artists.map(R.prop("name")).join(", ")}
                      </strong>
                      {` - ${shiftedTrack.name}`}
                    </td>
                  )}
                  <td>
                    {`${
                      albums.find(R.whereEq({ id: album.id }))?.name ?? "..."
                    }`}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </Table>
    </div>
  );
}
