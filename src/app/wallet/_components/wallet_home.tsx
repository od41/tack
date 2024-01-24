"use client"
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Transaction } from 'ethers';
import TransactionList from './transactions_list';

const WalletHome = () => {
  const [txList, setTxList] = useState<Transaction[] | null>(null);

  return (
    <div>
      <div className="flex items-center mb-4">

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>Wallet</AvatarFallback>
        </Avatar>
        <div className="ml-4">

          <div className='w-full grid grid-cols-2 items-end mb-1 gap-1'>
            <span className='section-heading'>My Wallet</span>
            {/* <Separator className='w-full bg-[#B4AAAA]' />  */}
          </div>
          <div className="text-xs text-gray-600 ">
            {/* {address} */}1Ffmb
          </div>
        </div>
      </div>

      <div className='mb-6'>
        <div className='w-full grid grid-cols-2 items-end mb-1 gap-1'>
          <span className='w-fit section-heading'>Balance</span>
          {/* <Separator className='w-full bg-[#B4AAAA]' /> */}
        </div>
        <div className="text-sm bg-stroke bg-opacity-20 border-white/50 border p-3 rounded-lg backdrop-blur-lg">
        <span className='w-fit section-heading'>ETH</span>
        <h4 className='w-fit text-lg text-stroke '>11.01</h4>

        </div>
      </div>

      <div className='mb-6'>
        <div className='w-full grid grid-cols-2 items-end mb-1 gap-1'>
          <span className='w-fit section-heading'>Savings</span>
          {/* <Separator className='w-full bg-[#B4AAAA]' /> */}
        </div>
        <div className="text-sm bg-stroke bg-opacity-20 border-white/50 border p-3 rounded-lg backdrop-blur-lg">
        <span className='w-fit section-heading'>ETH</span>
        <h4 className='w-fit text-lg text-stroke '>11.01</h4>

        </div>
      </div>

      <div>
        <div className='w-full grid grid-cols-2 items-end mb-1 gap-1'>
          <span className='w-fit section-heading'>Recent Activity</span>
          {/* <Separator className='w-full bg-[#B4AAAA]' /> */}
        </div>
        <div className="text-sm bg-stroke bg-opacity-20 border-white/50 border p-3 rounded-lg backdrop-blur-lg">
          <TransactionList walletAddress={"0xFCB6ee26891fcd71ca0884B2b8a989Fbdc4B2628"}/>
        </div>
      </div>

      <div className="flex flex-col w-full gap-5 mt-8 items-center mx-auto">
        <Button variant="destructive" size="sm" className="w-full">
          <Link href="/login">
            Logout
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default WalletHome;
