import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';
import Image from 'next/image';

import {
  PlayIcon,
  PauseIcon,
  FastForwardIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid';

import { VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline';
import useDebounce from '../hooks/useDebounce';

function Player() {
  const spotifyApi = useSpotify();

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const debouncedVolume = useDebounce<number>(+volume, 500);

  const songInfo = useSongInfo();

  const handlePlayAndPause = async () => {
    const currentState = await spotifyApi.getMyCurrentPlaybackState();
    if (currentState.body.is_playing) {
      spotifyApi.pause();
      setIsPlaying(false);
    } else {
      spotifyApi.play();
      setIsPlaying(true);
    }
  };
  useEffect(() => {
    spotifyApi.setVolume(debouncedVolume);
  }, [debouncedVolume, spotifyApi]);

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      <div className="flex items-center space-x-4">
        {songInfo?.album?.images?.[0]?.url && (
          <div className="relative hidden h-10 w-10 md:inline-block">
            <Image
              src={songInfo?.album?.images?.[0]?.url}
              layout="fill"
              alt="album image"
            />
          </div>
        )}
        <div>
          <h3>
            {songInfo?.name}
            <p>{songInfo?.artists?.[0]?.name}</p>
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />
        {isPlaying ? (
          <PauseIcon
            onClick={handlePlayAndPause}
            className="button h-10 w-10"
          />
        ) : (
          <PlayIcon onClick={handlePlayAndPause} className="button h-10 w-10" />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>

      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <VolumeDownIcon
          className="button"
          onClick={() => volume > 0 && setVolume((prev) => prev - 10)}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={(e) => {
            setVolume(+e.target.value);
          }}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          className="button"
          onClick={() => volume < 100 && setVolume((prev) => prev + 10)}
        />
      </div>
    </div>
  );
}
export default Player;
