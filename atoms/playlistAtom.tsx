import { atom } from 'recoil';

export const playlistIdState = atom<string>({
  key: 'playlistIdState',
  default: '',
});

export const playlistState = atom<SpotifyApi.SinglePlaylistResponse | any>({
  key: 'playlistAtomState',
  default: {},
});
