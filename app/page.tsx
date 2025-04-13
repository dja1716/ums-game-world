import { PlayIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';

interface Game {
  id: number;
  title: string;
  image?: string;
  genre: string;
  rating: string;
  href: string;
  preview?: boolean;
  bgColor?: string;
}

export default function Home() {
  const featuredGames: Game[] = [
    {
      id: 1,
      title: "테트리스",
      genre: "퍼즐",
      rating: "9.5",
      href: "/games/tetris",
      preview: true
    },
    {
      id: 2,
      title: "God of War Ragnarök",
      genre: "Action-Adventure",
      rating: "9.7",
      href: "#",
      bgColor: "bg-purple-800"
    },
    // 더 많은 게임들...
  ];

  const TetrisPreview = () => (
    <div className="w-full h-64 bg-gray-900 flex items-center justify-center p-4 font-mono">
      <div className="grid grid-cols-4 gap-1">
        <div className="bg-cyan-500 w-6 h-6" />
        <div className="bg-cyan-500 w-6 h-6" />
        <div className="bg-cyan-500 w-6 h-6" />
        <div className="bg-cyan-500 w-6 h-6" />
        <div className="bg-purple-500 w-6 h-6" />
        <div className="bg-purple-500 w-6 h-6" />
        <div className="bg-purple-500 w-6 h-6" />
        <div className="bg-transparent w-6 h-6" />
        <div className="bg-yellow-500 w-6 h-6" />
        <div className="bg-yellow-500 w-6 h-6" />
        <div className="bg-transparent w-6 h-6" />
        <div className="bg-transparent w-6 h-6" />
        <div className="bg-red-500 w-6 h-6" />
        <div className="bg-red-500 w-6 h-6" />
        <div className="bg-transparent w-6 h-6" />
        <div className="bg-transparent w-6 h-6" />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70" />
        <div className="relative h-full flex items-center px-8 md:px-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">테트리스</h1>
            <p className="text-lg md:text-xl mb-8">
              전설적인 퍼즐 게임을 지금 바로 플레이하세요. 블록을 쌓고, 줄을 완성하고, 최고 점수에 도전하세요!
            </p>
            <Link href="/games/tetris" className="inline-block">
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-700 transition">
                <PlayIcon className="w-6 h-6" />
                플레이 테트리스
              </button>
            </Link>
          </div>
          <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2">
            <div className="scale-150">
              <TetrisPreview />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Games */}
      <section className="px-8 md:px-16 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">인기 게임</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredGames.map((game) => (
            <Link href={game.href} key={game.id} className="group relative overflow-hidden rounded-lg">
              {game.preview ? (
                <TetrisPreview />
              ) : (
                <div className={`w-full h-64 ${game.bgColor || 'bg-gray-700'} transition-transform group-hover:scale-110`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-lg font-semibold">{game.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{game.genre}</span>
                  <span className="text-sm text-yellow-400">★ {game.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
