import '@/src/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/src/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js App with Sidebar',
  description: 'A modern Next.js application with navigation sidebar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Sidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
