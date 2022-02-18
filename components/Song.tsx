import useSpotify from '../hooks/useSpotify';
import millisecondsToSeconds from 'date-fns/millisecondsToSeconds';
import millisecondsToMinutes from 'date-fns/millisecondsToMinutes';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import Image from 'next/image';

interface Prop {
  trackItem: SpotifyApi.PlaylistTrackObject;
  order: number;
}

function Song(props: Prop) {
  const { trackItem, order } = props;
  const spotifyApi = useSpotify();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const handlePlaySong = () => {
    setCurrentTrackId(trackItem.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [trackItem.track.uri],
    });
  };

  return (
    <div
      className="grid cursor-pointer grid-cols-2 rounded-xl py-2 px-5 text-gray-500 hover:bg-gray-900"
      onClick={handlePlaySong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>

        <div className="h-10 w-10 relative">
          <Image
            layout="fill"
            src={trackItem.track.album.images[0].url}
            alt="album image"
          />
        </div>
        <div>
          <p className="w-36 truncate text-white lg:w-64">
            {trackItem.track.name}
          </p>
          <p className="w-40">{trackItem.track.artists[0].name}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center justify-between md:ml-0">
        <p className="hidden w-40 md:inline ">{trackItem.track.album.name}</p>
        <p>{`${millisecondsToMinutes(trackItem.track.duration_ms)}:${(
          millisecondsToSeconds(trackItem.track.duration_ms) % 60
        )
          .toString()
          .padStart(2, '0')}`}</p>
      </div>
    </div>
  );
}
export default Song;
