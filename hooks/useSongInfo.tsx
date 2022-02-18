import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from './useSpotify';

function useSongInfo() {
  const spotifyApi = useSpotify();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] =
    useState<SpotifyApi.SingleTrackResponse | null>(null);

  const setIsPlaying = useSetRecoilState(isPlayingState);

  useEffect(() => {
    if (!currentTrackId) {
      const fetch = async () => {
        const currentPlayingTrackInfo =
          await spotifyApi.getMyCurrentPlayingTrack();
        if (currentPlayingTrackInfo.body) {
          console.log(
            `You are playing ${currentPlayingTrackInfo.body.item?.name}`
          );
          setCurrentTrackId(currentPlayingTrackInfo!.body!.item!.id);
          setIsPlaying(currentPlayingTrackInfo.body.is_playing);
        }
      };
      fetch();
    } else {
      const fetch = async () => {
        const trackInfo = await spotifyApi.getTrack(currentTrackId);
        setSongInfo(trackInfo.body);
      };
      fetch();
    }
  }, [currentTrackId, spotifyApi]);

  return songInfo;
}
export default useSongInfo;
