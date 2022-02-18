import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtom';
import Song from './Song';

function Songs() {
  const playlist = useRecoilValue<SpotifyApi.SinglePlaylistResponse>(playlistState);

  console.log(playlist);
  return (
    <div className="text-white px-8 flex flex-col pb-24 bg-[#121212]">
      {playlist?.tracks?.items.map((item, index) => {
        return <Song key={item.track.id} trackItem={item} order={index} />;
      })}
    </div>
  );
}
export default Songs;
