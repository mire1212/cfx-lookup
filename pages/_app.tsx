import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React from 'react'
import { App as MainApp } from '../App'
import '../App.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return <Component {...pageProps} />
}

