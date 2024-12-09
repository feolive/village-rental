import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'


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
    <html lang="en" data-theme="dim">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}