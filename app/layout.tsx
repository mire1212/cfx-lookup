import type { Metadata } from 'next'
import { JetBrains_Mono } from "next/font/google"
import '../styles/globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: 'Access Denied',
  description: 'You dont have permission to access this page.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.className}>{children}</body>
    </html>
  )
}



import './globals.css'
