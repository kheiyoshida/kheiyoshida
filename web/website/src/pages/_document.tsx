import { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'

const PUBLIC_GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function Document() {
  return (
    <Html lang="en">

      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GA_ID}`}></Script>
      <Script id={'gtag'}>
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${PUBLIC_GA_ID}');`}
      </Script>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
