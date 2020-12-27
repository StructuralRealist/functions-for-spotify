import React from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import * as R from "ramda";

import s from "./spotify";
import { sameAlbum } from "./functions";

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-size: 48px;
  margin: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  display: flex;

  img {
    width: 60px;
    height: auto;
    margin-right: 20px;
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 40px;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;

  th {
    text-align: left;
  }

  td,
  th {
    padding: 10px 10px 10px;
  }
`;

export default function FunctionsTable() {
  const history = useHistory();
  const { playlistId, userId } = useParams<{
    playlistId: string;
    userId: string;
  }>();
  const [playlist, setPlaylist] = React.useState<any>();
  const [values, setValues] = React.useState({
    public: false,
    name: "",
  });

  // Load playlist and albums for each track
  React.useEffect(() => {
    (async () => {
      // Get the playlist details
      const playlist = await s.getPlaylist(playlistId);
      console.log("PLAYLIST", playlist);
      setPlaylist(playlist);
    })();
  }, [playlistId]);

  // Create playlist
  const createPlaylist = React.useCallback(
    async (transformer: Function) => {
      await transformer(playlistId, {
        userId,
        playlistPublic: values.public,
        playlistName: values.name,
      });
      alert("Your playlist has been created!");
      history.push(`/${userId}`);
    },
    [values]
  );

  return (
    <Container>
      <Header>
        <Link to={`/${userId}`}>Back</Link>
        <Title>
          <img src={playlist?.images[1]?.url} alt="" />
          {`${playlist?.name ?? playlistId}`}
        </Title>
      </Header>
      <Buttons>
        <input
          type="text"
          placeholder="New playlist name"
          value={values.name}
          onChange={(e) => setValues(R.assoc("name", e.target.value))}
        />
        <label htmlFor="playlistPublic">
          <input
            id="playlistPublic"
            type="checkbox"
            value="on"
            checked={values.public}
            onChange={() => setValues(R.assoc("public", !values.public))}
          />
          {" Public"}
        </label>
      </Buttons>
      <Table>
        <thead>
          <tr>
            <th colSpan={2}>Function</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Different track from the same album</td>
            <td>
              <button
                onClick={() => createPlaylist(sameAlbum)}
                disabled={!values.name}
              >
                Create playlist
              </button>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}
