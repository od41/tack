import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from "@/components/ui/toaster"
import Container from './_components/container'
import Image from 'next/image'
import { WalletProvider } from './_components/wallets_context'
const threeDCubesBg = require("@/assets/3d-cubes.png")


const plusJakartaFont = Plus_Jakarta_Sans({subsets: ["latin"]})

export const metadata: Metadata = {
  title: 'Tack',
  description: 'Smart savings for you',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={`${plusJakartaFont.className} overflow-hidden bg-[url('/blur-bg.png')] flex items-center justify-center`}>
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
  <Image src={String(threeDCubesBg.default.src)} alt="image" width={460} height={536} className=' z-0 '/>
</div> 
      </body>
    </html>
  );
}
