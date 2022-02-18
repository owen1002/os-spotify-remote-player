import SpotifyWebApi from 'spotify-web-api-node';

const scopes = [
  'user-read-email',
  'user-read-private',
  'user-follow-read',
  'user-library-read',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
].join(',');

const params = {
  scope: scopes,
};

const queryString = new URLSearchParams(params);

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryString.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
});

export default spotifyApi;
export { LOGIN_URL };
