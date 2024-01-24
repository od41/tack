"use client"
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const GenerateWallet = () => {
  const [seedPhrase, setSeedPhrase] = useState('');

  const generateWallet = () => {
    // Generate a new wallet
    const wallet = ethers.Wallet.createRandom();
    const generatedSeedPhrase = wallet.mnemonic.phrase;
    setSeedPhrase(generatedSeedPhrase);
  };

  return (
    <div>
        <Button onClick={generateWallet} disabled={seedPhrase ? true:false} className='w-full mb-4'>Generate Wallet</Button>
      {seedPhrase && <div>
        <div className='w-full grid grid-cols-2 items-end mb-1 gap-1'>
          <span className='w-fit section-heading'>Recovery Phrase</span>
          {/* <Separator className='w-full bg-[#B4AAAA]' /> */}
        </div>
        <div className="text-sm bg-[#EEEEF0] bg-opacity-20 border-white/50 border p-3 rounded-lg backdrop-blur-lg">
          {seedPhrase}
        </div>
      </div>}

      <div className="flex flex-col w-full gap-5 mt-8 items-center mx-auto">
        {seedPhrase && <Button size="sm" variant="outline" className="w-full">
          <Link href="/wallet">
            Open Your New Wallet
          </Link>
          </Button>}
        <Button  variant="ghost" size="sm" className="w-full">
        <Link href="/new">
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default GenerateWallet;
