import type { Metadata } from 'next'
import { JetBrains_Mono } from "next/font/google"
import '../styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
      <body className={jetbrainsMono.className}>{children}
      <SpeedInsights />
      </body>
    </html>
  )
}



import './globals.css'
