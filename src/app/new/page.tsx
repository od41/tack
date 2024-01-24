import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
const threeDCubesBg = require("@/assets/3d-cubes.png")

const WelcomePage = () => {
  return (
    <>
      <div className='relative w-full flex justify-center'>
  <Image src={String(threeDCubesBg.default.src)} alt="image" width={300} height={300} className=' z-0 '/>
</div> 
      <h2 className="text-lg font-bold text-center my-4">
        Welcome to Tack!
      </h2>

      <div className="flex flex-col w-full gap-5 items=center mx-auto">
        <Button>
        <Link href="/new/wallet">
          Create New Wallet
          </Link>
        </Button>
        <Button variant="outline">
          <Link href="/new/recover">
            Recover with Seed Phrase
          </Link>
        </Button>
      </div>
    </>
  )
}

export default WelcomePage