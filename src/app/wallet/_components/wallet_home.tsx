"use client"
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const WalletHome = () => {
  const [balance, setBalance] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState('0xFCB6ee26891fcd71ca0884B2b8a989Fbdc4B2628')

  const checkBalance = async () => {
    try {
      // Connect to an Ethereum node
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
      const balanceWei = await provider.getBalance(walletAddress);
      const balanceEth = ethers.utils.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));
    } catch (error) {
      console.error('Error fetching balance:', (error as Error).message);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      await checkBalance()
    }
    fetchBalance()
  }, [walletAddress])


  return (
    <div>
      <div className='my-6'>
        <div className='w-full grid grid-cols-2 items-end mb-1 gap-1'>
          <span className='w-fit section-heading'>Balance</span>
          {/* <Separator className='w-full bg-[#B4AAAA]' /> */}
        </div>
        <div className="text-sm bg-stroke bg-opacity-20 border-white/50 border p-3 rounded-lg backdrop-blur-lg">
          <span className='w-fit section-heading'>ETH</span>
          <h4 className='w-fit text-lg text-stroke '>{balance}</h4>

        </div>
      </div>

      <div className="flex w-full gap-3 mb-6">
        <Button variant="outline" className='w-full'>
        <Link href="/wallet/send">
            Send
          </Link>
        </Button>
        <Button variant="outline" className='w-full'>
        <Link href="/wallet/receive">
            Receive
          </Link>
        </Button>
      </div>

      {/* <div className='mb-6'>
        <div className='w-full grid grid-cols-2 items-end mb-1 gap-1'>
          <span className='w-fit section-heading'>Savings</span>
          {/* <Separator className='w-full bg-[#B4AAAA]' /> 
        </div>
        <div className="text-sm bg-stroke bg-opacity-20 border-white/50 border p-3 rounded-lg backdrop-blur-lg">
        <span className='w-fit section-heading'>ETH</span>
        <h4 className='w-fit text-lg text-stroke '>11.01</h4>

        </div>
      </div> */}

      <div>
        <div className='w-full grid grid-cols-2 items-end mb-1 gap-1'>
          <span className='w-fit section-heading'>Recent Activity</span>
          {/* <Separator className='w-full bg-[#B4AAAA]' /> */}
        </div>
        <div className="text-sm bg-stroke bg-opacity-20 border-white/50 border p-3 rounded-lg backdrop-blur-lg">
          {/* <TransactionList walletAddress={walletAddress}/> */}
        </div>
      </div>
    </div>
  );
};

export default WalletHome;
