import * as React from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

import s from "./spotify";

const Title = styled.h2`
  text-align: center;
`;

const Playlist = styled.li`
  display: block;
  margin-bottom: 20px;

  a {
    display: flex;
    align-items: center;
  }

  img {
    width: 60px;
    height: 60px;
    border-radius: 3px;
    flex: none;
    margin-right: 20px;
  }
`;

const ImagePlaceholder = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 3px;
  flex: none;
  background-color: lightslategray;
  margin-right: 20px;
`;

export default function Playlists() {
  const { userId } = useParams<{ userId: string }>();
  const [playlists, setPlaylists] = React.useState<any[]>([]);
  React.useEffect(() => {
    s.getUserPlaylists().then((data) => {
      setPlaylists(data.items);
    });
  }, []);

  return (
    <div>
      <Title>Select a playlist</Title>
      <ul>
        {playlists.map(({ id, name, images }) => (
          <Playlist key={id}>
            <Link to={`/${userId}/${id}`}>
              {images[1] ? (
                <img src={images[1]?.url} alt="" />
              ) : (
                <ImagePlaceholder />
              )}
              {name}
            </Link>
          </Playlist>
        ))}
      </ul>
    </div>
  );
}
