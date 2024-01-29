"use client"
import React, { useContext } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TransactionList from './transactions_list';
import { WalletContext } from '@/app/_components/wallets_context';
import { Skeleton } from '@/components/ui/skeleton';
import { convertEthToUsd } from '@/lib/utils';

const WalletHome = () => {
  const {balance, isBalanceLoading, exchangeRate} = useContext(WalletContext)

  return (
    <div>
      <div className='my-6'>
        <div className='w-full grid grid-cols-2 items-end mb-1 gap-1'>
          <span className='w-fit section-heading'>Balance</span>
          {/* <Separator className='w-full bg-[#B4AAAA]' /> */}
        </div>
        <div className="text-sm flex w-full justify-between items-end bg-blue-glass bg-opacity-90 border-[#8AA1E7]]/30 border p-3 rounded-lg backdrop-blur-lg">
          <div className="">
            <span className='w-fit section-heading text-white'>ETH</span>
            {isBalanceLoading ? <Skeleton className="bg-white bg-opacity-80 h-7 w-[100px]" /> : <h4 className='w-fit text-lg text-white font-medium '>{balance}</h4>}
          </div>
          <div className="text-right">
            {isBalanceLoading ? 
              <Skeleton className="bg-white bg-opacity-80 h-5 w-[80px]" /> 
              : <h4 className='w-fit text-md text-white font-medium '>${convertEthToUsd(parseFloat(balance!), exchangeRate)}</h4>
            }
          </div>
        </div>
      </div>

      <div className="flex w-full gap-3 mb-6">
        <Button variant="outline" className='w-full' asChild>
        <Link href="/wallet/send">
            Send
          </Link>
        </Button>
        {/* <Button variant="outline" className='w-full' asChild>
        <Link href="/wallet/receive">
            Receive
          </Link>
        </Button> */}
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
