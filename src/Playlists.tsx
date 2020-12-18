import * as React from "react";
import { Link } from "react-router-dom";

import s from "./spotify";

export default function Playlists() {
  const [playlists, setPlaylists] = React.useState<any[]>([]);
  React.useEffect(() => {
    s.getUserPlaylists().then((data) => {
      setPlaylists(data.items);
    });
  }, []);

  return (
    <div>
      <h2>Select a playlist</h2>
      <ul className="Playlists">
        {playlists.map(({ id, name, images }) => (
          <li className="Playlist" key={id}>
            <Link to={`/${id}`}>
              {images[1] ? (
                <img src={images[1]?.url} alt="" />
              ) : (
                <div className="ImagePlaceholder" />
              )}
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
