'use client'
import { Button } from '@/components/ui/button'
import React, {useState, useContext} from 'react'
import { WalletContext } from './_components/wallets_context'
import Image from 'next/image'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
const threeDCubesBg = require("@/assets/3d-cubes.png")

const WelcomePage = () => {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const {login} = useContext(WalletContext)
  const router = useRouter()
  
  const handleLogin = async (e: any) => {
    setLoading(true)
    e.preventDefault()
    
    login(password).then(res => {
      if(res) {
        setLoading(false)
        router.push('/wallet')
      } else {
          setLoading(false)
          alert ('something went wrong')
        }
    })
  }


  return (
    <>
      <h2 className="text-lg font-bold text-center my-4">
        Welcome to Drops Wallet
      </h2>
      <div className='relative w-full flex justify-center'>
        <Image src={String(threeDCubesBg.default.src)} alt="image" width={150} height={300} className=' z-0 ' />
      </div> 

      <div className="text-sm bg-stroke bg-opacity-20 border-white/50 border px-3 py-5 rounded-lg backdrop-blur-lg">
        <div className="grid w-full max-w-sm items-center gap-1.5 mb-4 mb-6">
          <div className="flex w-full justify-between">
            <Label htmlFor="password" className='section-heading'>Password</Label>
          </div>
          <Input type="password" id="password" disabled={loading} placeholder="Your password" value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }} />
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          <Button onClick={handleLogin} className='w-1/2' disabled={loading || password == ""} isLoading={loading}>
            Unlock
          </Button>


          <div className='text-center mt-3'>
            <div className='text-xs text-[#333]'>
              Did you forget your password?
            </div>
            <Button variant="link" className='text-xs w-fit text-accent-2 h-5' asChild>
              <Link href="/new/recover">
                Recover Wallet
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

export default WelcomePage