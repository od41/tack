import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html>
      <Head />
      <body className={`overflow-hidden bg-[url('/blur-bg.png')] flex items-center justify-center`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}