import type { AppProps } from 'next/app'
import React from 'react'
import { App } from '../App'
import '../App.css'

export default function App({ Component, pageProps }: AppProps) {
  return <App Component={Component} pageProps={pageProps} />
}

