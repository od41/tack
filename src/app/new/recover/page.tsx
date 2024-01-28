'use client'
import { Button } from '@/components/ui/button'
import React, {useState, useContext} from 'react'
import { WalletContext } from '@/app/_components/wallets_context'
import Image from 'next/image'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
const threeDCubesBg = require("@/assets/3d-cubes.png")
import { useRouter } from 'next/navigation'

const RecoverPage = () => {
  const [seedPhrase, setSeedPhrase] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const {recover, walletAddress} = useContext(WalletContext)
  const router = useRouter()

  const handleRecover = (e: any) => {
    setLoading(true)
    e.preventDefault()
    
    try {
      recover(seedPhrase)
      setLoading(false)
      router.push('/wallet')

    }catch(err){
      setLoading(false)
      setErrorMessage((err as Error).message)
    }
  }


  return (
    <>
      <h2 className="text-lg font-bold text-center my-4">
        Recover Wallet
      </h2>
      {/* <div className='relative w-full flex justify-center'>
        <Image src={String(threeDCubesBg.default.src)} alt="image" width={150} height={300} className=' z-0 ' />
      </div>  */}

      <div className="text-sm bg-stroke bg-opacity-20 border-white/50 border px-3 py-5 rounded-lg backdrop-blur-lg">
        <div className="grid w-full max-w-sm items-center gap-1.5 mb-4 mb-6">
          <div className="flex w-full justify-between">
            <Label htmlFor="seed-phrase" className='section-heading'>Seed Phrase</Label>
          </div>
          <Textarea id="seed-phrase" disabled={loading} placeholder="Enter seed phrase" value={seedPhrase}
            onChange={(e) => {
              setSeedPhrase(e.target.value);
            }} />
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          <Button onClick={handleRecover} className='w-1/2' disabled={loading} isLoading={loading}>
            Recover
          </Button>


          <div className='text-center mt-3'>
            {/* <div className='text-xs text-[#333]'>
              Do you have a wallet?
            </div> */}
            <Button variant="link" className='text-xs w-fit text-accent-2 h-5' asChild>
              <Link href="/">
                Login
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-5 items=center justify-center mt-4">
        <div className='text-center'>
          <div className='mr-1 text-xs text-[#333]'>
            Are you new here? 
          </div>
        <Button variant="link" className='text-xs w-fit text-accent-2 h-5' asChild>
        <Link href="/new/wallet">
          Create a Wallet
          </Link>
        </Button>
        </div>
        
      </div>
    </>
  )
}

export default RecoverPage