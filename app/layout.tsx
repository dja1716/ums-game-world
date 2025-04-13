import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Um&apos;s Game World - 온라인 게임 플랫폼",
  description: "Um&apos;s Game World에서 다양한 게임을 즐겨보세요",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className={`${inter.className} bg-black`}>
        <nav className="fixed w-full z-50 bg-gradient-to-b from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-red-600 font-bold text-2xl">Um&apos;s Game World</Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">홈</Link>
                  <Link href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">인기 게임</Link>
                  <Link href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">새로운 게임</Link>
                  <Link href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">내 라이브러리</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
