import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'
const threeDCubesBg = require("@/assets/3d-cubes.png")

const WelcomePage = () => {
  return (
    <>
      <div className='relative w-full flex justify-center'>
  <Image src={String(threeDCubesBg.default.src)} alt="image" width={300} height={300} className=' z-0 '/>
</div> 
      <h2 className="text-lg">
        Welcome to Tack!
      </h2>

      <div className="flex flex-col w-1/2 gap-3 items=center">
        <Button>Create New Wallet</Button>
        <Button>Recover with Seed Phrase</Button>
      </div>
    </>
  )
}

export default WelcomePage