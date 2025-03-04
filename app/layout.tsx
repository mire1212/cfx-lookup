import type { Metadata } from 'next'
import { JetBrains_Mono } from "next/font/google"
import '../styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import React from 'react'

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: 'CFX LOOKUP',
  description: 'Check Players',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <SpeedInsights />
    </html>
  )
}

import './globals.css'
