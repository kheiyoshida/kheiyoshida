import { Menu } from '@/components/site/Menu'
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'

const PUBLIC_GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        id="ganalytics"
        strategy="lazyOnload"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GA_ID}`}
      ></Script>
      <Script id={'gtag'} strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${PUBLIC_GA_ID}');`}
      </Script>
      <Head>
        <title>Khei Yoshida</title>
        <meta name="description" content="Khei Yoshida" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Menu />

      <div className="container">
        <div className="container__body">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  )
}
