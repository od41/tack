import type { Metadata } from 'next'
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from "@/components/ui/toaster"
import Container from '../components/pages/root/container'
import Image from 'next/image'
import { WalletProvider } from '@/context/wallet'
import { Plus_Jakarta_Sans } from 'next/font/google'

const threeDCubesBg = require("@/assets/3d-cubes.png")

const plusJakartaFont = Plus_Jakarta_Sans({subsets: ["latin"]})


// export const metadata: Metadata = {
//   title: 'Drops',
//   description: 'Wallet and savings browser extension',
// }

export default function RootLayout({ Component, pageProps, router }: AppProps) {

  return (
    <main className={plusJakartaFont.className}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <WalletProvider>
          <Container>
            <Toaster />
            <Component {...pageProps} key={router.asPath} />
          </Container>
        </WalletProvider>
      </ThemeProvider>
      <div className='absolute bottom-[-10rem] right-0'>
  <Image src={String(threeDCubesBg.default.src)} alt="image" width={460} height={536} className=' z-0 '/>
</div> 
    </main>
  );
}


