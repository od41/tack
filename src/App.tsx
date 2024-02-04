import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from "@/components/ui/toaster"
import Container from './components/pages/root/container'
import Image from 'next/image'
import { WalletProvider } from '@/context/wallet'
import { Plus_Jakarta_Sans } from 'next/font/google'
import React from 'react'

// @ts-ignore
import cssText from "data-text:@/styles/globals.css"

// const threeDCubesBg = require("@/assets/3d-cubes.png")

// const plusJakartaFont = Plus_Jakarta_Sans({subsets: ["latin"]})


// export const metadata: Metadata = {
//   title: 'Drops',
//   description: 'Wallet and savings browser extension',
// }

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function AppLayout({ children }: {children: React.ReactNode}) {

  return (
    <main className={`${'plusJakartaFont.className'} overflow-hidden bg-[url('/blur-bg.png')] flex items-center justify-center`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        >
        <WalletProvider>
          <Container>
            <Toaster />
            {children}
          </Container>
        </WalletProvider>
      </ThemeProvider>
      <div className='absolute bottom-[-10rem] right-0'>
  {/* <Image src={String(threeDCubesBg.default.src)} alt="image" width={460} height={536} className=' z-0 '/> */}
</div> 

    </main>
  );
}


