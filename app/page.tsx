import { PlayIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

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
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Um&apos;s Game World</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/games/tetris" className="block">
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <h2 className="text-2xl font-semibold mb-4">테트리스</h2>
            <p className="text-gray-400">클래식 테트리스 게임을 즐겨보세요.</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
