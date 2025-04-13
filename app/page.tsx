import Link from 'next/link';

export default function Home() {
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
