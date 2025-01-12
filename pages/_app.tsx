import type { AppProps } from 'next/app'
import { App } from '../App'
import '../App.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <App Component={Component} pageProps={pageProps} />
}

