import * as React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import styled from "styled-components";

import { authorize, restoreAccessToken, clearSession } from "./spotify";
import Playlists from "./Playlists";
import PivotForm from "./PivotForm";
import GlobalStyles from "./GlobalStyles";
import logo from "./logo.png";

const Main = styled.main`
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const Session = styled.div`
  margin-bottom: 40px;
`;

const AppLogo = styled.div`
  padding: 40px;
  img {
    height: auto;
    width: 200px;
  }
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
    <>
      <GlobalStyles />
      <Main>
        <AppLogo>
          <img src={logo} alt="" />
        </AppLogo>
        {user && (
          <Session>
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
          </Session>
        )}
        {user ? (
          <Switch>
            <Route path="/:userId/:playlistId" component={PivotForm} />
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
    </>
  );
}
