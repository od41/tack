"use client"
import React, { useEffect, useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TransactionList from './transactions_list';
import { WalletContext } from '@/app/_components/wallets_context';

const WalletHome = () => {
  const {balance} = useContext(WalletContext)

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
        <Button variant="outline" className='w-full' asChild>
        <Link href="/wallet/send">
            Send
          </Link>
        </Button>
        <Button variant="outline" className='w-full' asChild>
        <Link href="/wallet/receive">
            Receive
          </Link>
        </Button>
      </div>

      <div>
        <div className='w-full grid grid-cols-2 items-end mb-1 gap-1'>
          <span className='w-fit section-heading'>Recent Activity</span>
          {/* <Separator className='w-full bg-[#B4AAAA]' /> */}
        </div>
        <div className="text-sm bg-stroke bg-opacity-20 border-white/50 border p-3 rounded-lg backdrop-blur-lg">
          <TransactionList />
        </div>
      </div>
    </div>
  );
};

export default WalletHome;
