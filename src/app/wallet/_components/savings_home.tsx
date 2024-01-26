"use client"
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import TransactionList from './transactions_list';
import { formatAddress } from '@/lib/utils';

const SavingsHome = () => {
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
          <span className='w-fit section-heading'>savings</span>
          {/* <Separator className='w-full bg-[#B4AAAA]' /> */}
        </div>
        <div className="text-sm bg-stroke bg-opacity-20 border-white/50 border p-3 rounded-lg backdrop-blur-lg">
          <span className='w-fit section-heading'>ETH</span>
          <h4 className='w-fit text-lg text-stroke '>{balance}</h4>

        </div>
      </div>

      <div className="flex w-full gap-3 mb-6">
        <Button variant="outline" className='w-full' asChild>
        <Link href="/wallet/deposit">
            Deposit
          </Link>
        </Button>
        <Button variant="outline" className='w-full' asChild>
        <Link href="/wallet/withdraw">
            Withdraw
          </Link>
        </Button>
      </div>


    </div>
  );
};

export default SavingsHome;
