import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../pages/App.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Error 404: Access Denied | Secure Server',
  description: 'Error 404: The requested resource could not be found. Access to this page is restricted.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'