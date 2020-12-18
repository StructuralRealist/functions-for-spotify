import Qs from "qs";
import Spotify from "spotify-web-api-js";

const CLIENT_ID = "bbdb8aeebf8c4f019d14983574e918fb";
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
  window.open(
    `${AUTH_ENDPOINT}?${Qs.stringify({
      client_id: CLIENT_ID,
      response_type: "token",
      redirect_uri: "https://4s4xs.csb.app",
      scope:
        "playlist-read-private,playlist-read-collaborative,playlist-modify-private",
    })}`
  );
};

export default s;
