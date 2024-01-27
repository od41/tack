"use client"
import React, { useContext } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton"
import { WalletContext } from '@/app/_components/wallets_context';
import { convertEthToUsd } from '@/lib/utils';


const SavingsHome = () => {
  const { balance, isBalanceLoading, exchangeRate, wallet, walletAddress, savingsWallet, createNewSavingsWallet } = useContext(WalletContext)

  function handleCreateNewSavingsWallet() {
    // do stuff
  }

  if(savingsWallet) {
    return <div className='flex flex-col items-center my-8'>
      <div className="text-sm mb-4">
        No savings wallet found
      </div>
      <Button variant="outline" onClick={handleCreateNewSavingsWallet}>Create new savings wallet</Button>
      </div>
  }

  return (
    <div>
      <div className='my-6'>
        <div className='w-full grid grid-cols-2 items-end mb-1 gap-1'>
          <span className='w-fit section-heading'>savings</span>
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
