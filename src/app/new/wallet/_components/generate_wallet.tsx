"use client"
import React, { useState, useContext, } from 'react';
import { WalletContext } from '@/app/_components/wallets_context';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
const threeDCubesBg = require("@/assets/3d-cubes.png")

const GenerateWallet = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const { generateWallet: generateEncryptedJsonWallet, walletAddress } = useContext(WalletContext)
  const router = useRouter()

  const generateWallet = () => {
    // Generate a new wallet
    const wallet = ethers.Wallet.createRandom();
    const generatedSeedPhrase = wallet.mnemonic.phrase;
    setSeedPhrase(generatedSeedPhrase);
  };





  const handleGenerateWallet = async (e: any) => {
    setLoading(true)
    e.preventDefault()
    const status = await generateEncryptedJsonWallet(password, seedPhrase)
    if (status) {
      setLoading(false)
      router.push('/wallet')
    } else {
      setLoading(false)
      alert('something went wrong')
    }
  }

  return (
    <div>
      <div className='relative w-full flex justify-center'>
        <Image src={String(threeDCubesBg.default.src)} alt="image" width={150} height={300} className=' z-0 ' />
      </div>

      {seedPhrase ? <div>
        <div className='w-full grid grid-cols-2 items-end mb-1 gap-1'>
          <span className='w-fit section-heading'>Recovery Phrase</span>
          {/* <Separator className='w-full bg-[#B4AAAA]' /> */}
        </div>
        <div className="text-sm bg-[#EEEEF0] bg-opacity-20 border-white/50 border p-3 rounded-lg backdrop-blur-lg">
          {seedPhrase}
        </div>
      </div> : <Button onClick={generateWallet} disabled={seedPhrase ? true : false} className='w-full mb-4'>Generate Wallet</Button>}

      <div className="flex flex-col w-full gap-5 mt-8 items-center mx-auto">
        {seedPhrase && <>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-4 mb-6">
            <div className="flex w-full justify-between">
              <Label htmlFor="password" className='section-heading'>Password</Label>
            </div>
            <Input type="password" id="password" disabled={loading} placeholder="Your password" value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }} />
          </div>
          <Button onClick={handleGenerateWallet} variant="outline" className="w-full" disabled={password == "" || loading} isLoading={loading}>
            Open Your New Wallet
          </Button></>}
        <Button variant="link" size="sm" className="text-xs w-fit text-accent-2 h-5" asChild>
          <Link href="/">
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default GenerateWallet;
