import { ChevronDownIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import Image from 'next/image';
import Songs from './Songs';
import useSpotify from '../hooks/useSpotify';

const colors = [
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-pink-500',
  'from-yellow-500',
];

function Center() {
  const { data: session } = useSession();
  const [color, setColor] = useState<string>(colors[0]);
  const spotifyApi = useSpotify();

  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop()!);
  }, []);

  useEffect(() => {
    if (playlistId) {
      const fetch = async () => {
        try {
          const response = await spotifyApi.getPlaylist(playlistId);
          setPlaylist(response.body);
        } catch (e) {
          console.error(`SOMETHING WENT WRONG`, e);
        }
      };
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistId]);

  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        {session && (
          <div
            className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 opacity-90 hover:opacity-80"
            onClick={() => signOut()}
          >
            <div className="relative h-10 w-10 rounded-full">
              <Image
                layout="fill"
                className="rounded-full"
                src={session.user.image}
                alt="profile pic"
              />
            </div>
            <h2 className="text-white">{session.user.name}</h2>
            <ChevronDownIcon className="h-5 w-5 text-white" />
          </div>
        )}
      </header>
      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-[#121212] p-8 text-white`}
      >
        {playlist?.images?.[0]?.url ? (
          <div className="relative h-44 w-44 shadow-2xl">
            <Image
              layout="fill"
              src={playlist?.images?.[0]?.url}
              alt="playlist image"
            />
          </div>
        ) : (
          <></>
        )}
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl">{playlist?.name}</h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
}
export default Center;
