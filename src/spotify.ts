import Qs from "qs";
import Spotify from "spotify-web-api-js";

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";

const s = new Spotify();

export const restoreAccessToken = async () => {
  const token =
    Qs.parse(window.location.hash.slice(1)).access_token?.toString() ||
    localStorage.getItem("spotify_access_token");

  if (token) {
    localStorage.setItem("spotify_access_token", token);
    s.setAccessToken(token);
    window.location.hash = "";

    try {
      const user = await s.getMe();
      console.log("USER", user);
      return user;
    } catch (err) {
      clearSession();
      console.log("User token not valid");
      return null;
    }
  }

  return null;
};

export const clearSession = () => {
  localStorage.removeItem("spotify_access_token");
  s.setAccessToken(null);
};

export const authorize = () => {
  window.location.href = `${AUTH_ENDPOINT}?${Qs.stringify({
    client_id: process.env.REACT_APP_CLIENT_ID,
    response_type: "token",
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    scope:
      "playlist-read-private,playlist-read-collaborative,playlist-modify-private,playlist-modify-public",
  })}`;
};

export default s;
