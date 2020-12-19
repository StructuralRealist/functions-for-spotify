import * as React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import styled from "styled-components";

import { authorize, restoreAccessToken, clearSession } from "./spotify";
import Playlists from "./Playlists";
import ShiftList from "./ShiftList";

const Main = styled.main`
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  font-family: "Anonymous Pro", monospace;
`;

const AppName = styled.h1`
  font-family: "Major Mono Display", sans-serif;
  font-size: 48px;
  text-transform: uppercase;
`;

export default function App() {
  const [user, setUser] = React.useState<Record<string, any> | null>(null);
  const history = useHistory();

  React.useEffect(() => {
    (async () => {
      const user = await restoreAccessToken();

      setUser(user);
    })();
  }, []);

  React.useEffect(() => {
    if (user?.id) {
      history.push(`/${user.id}`);
    }
  }, [user?.id]);

  return (
    <Main>
      <AppName>ShiftList</AppName>
      {user && (
        <div>
          Logged in as{" "}
          <a
            href={user.external_urls?.spotify}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {user.display_name}
          </a>{" "}
          <button
            onClick={() => {
              clearSession();
              setUser(null);
            }}
          >
            Log out
          </button>
        </div>
      )}
      {user ? (
        <Switch>
          <Route path="/:userId/:playlistId" component={ShiftList} />
          <Route path="/:userId" component={Playlists} />
        </Switch>
      ) : (
        <button
          onClick={() => {
            authorize();
          }}
        >
          Log in to Spotify
        </button>
      )}
    </Main>
  );
}
