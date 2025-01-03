import '@/app/globals.css'
import type { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'


export const metadata: Metadata = {
  title: 'Next.js App with Sidebar',
  description: 'A modern Next.js application with navigation sidebar',
}

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='text-base-content bg-base-100'>
      <Sidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
