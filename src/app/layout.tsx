import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GearShift Status - Real-time System Status',
  description: 'Monitor the real-time status of GearShift services, components, and platform metrics.',
  keywords: 'GearShift, status, uptime, monitoring, system status, real-time',
  authors: [{ name: 'GearShift Team' }],
  openGraph: {
    title: 'GearShift Status',
    description: 'Real-time system status and platform metrics for GearShift',
    type: 'website',
    url: 'https://status.getgearshift.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GearShift Status',
    description: 'Real-time system status and platform metrics for GearShift',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  )
}