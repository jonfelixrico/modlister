import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { StyleProvider } from '@/client-wrapper/antd-client-wrapper'
import MainLayout from '@/components/MainLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Modlister',
  description: 'MC mod downloader',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StyleProvider hashPriority="high">
      <html lang="en" className={inter.className}>
        <body>
          <MainLayout>{children}</MainLayout>
        </body>
      </html>
    </StyleProvider>
  )
}
