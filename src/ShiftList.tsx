import React from "react";
import { useParams, Link } from "react-router-dom";

import s from "./spotify";

export default function ShiftList() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const [tracks, setTracks] = React.useState<any[]>([]);

  React.useEffect(() => {
    s.getPlaylistTracks(playlistId).then((data) => {
      console.log("DATA", data);
      setTracks(data.items ?? []);
    });
  }, [playlistId]);

  return (
    <div>
      <h2>{`Playlist id: ${playlistId}`}</h2>
      <div>
        <Link to="/">Back</Link>
      </div>

      {tracks.map(({ track: { id, name } }) => (
        <li key={id}>{name}</li>
      ))}
    </div>
  );
}
