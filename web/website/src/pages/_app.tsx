import { Menu, SpMenu } from '@/components/site/Menu'
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Khei Yoshida</title>
        <meta name="description" content="Khei Yoshida" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="canvas"></div>
      <SpMenu />

      <div className="container">
        <div className="container__menu">
          <Menu />
        </div>
        <div className="container__body">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  )
}
