import * as React from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";

import { authorize, restoreAccessToken, clearSession } from "./spotify";
import Playlists from "./Playlists";
import ShiftList from "./ShiftList";

export default function App() {
  const [user, setUser] = React.useState<Record<string, any> | null>(null);

  React.useEffect(() => {
    (async () => {
      const user = await restoreAccessToken();

      setUser(user);
    })();
  }, []);

  return (
    <div className="App">
      <h1 className="AppName">SHIFT LIST</h1>
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
            }}
          >
            Log out
          </button>
        </div>
      )}
      {user ? (
        <Switch>
          <Route path="/:playlistId" component={ShiftList} />
          <Route path="" component={Playlists} />
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
    </div>
  );
}
