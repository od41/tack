"use client"
import React, { useContext } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton"
import { WalletContext } from '@/app/_components/wallets_context';
import { convertEthToUsd } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangleIcon } from 'lucide-react';
import { ethers } from 'ethers';


const SavingsHome = () => {
  const { balance, isBalanceLoading, exchangeRate, wallet, walletAddress, savingsWallet, createNewSavingsWallet, errorMessage } = useContext(WalletContext)

  const {
    savingsWalletAddress,
    balance: savingsWalletBalance,
    isLoading: isSavingsWalletLoading,
    withdrawalDateTimestamp
} = savingsWallet

  function handleCreateNewSavingsWallet() {
    createNewSavingsWallet(15)
  }

  async function handleWithdraw(e: any) {
    e.preventDefault()
    // do stuff
    alert("withdraw")
  }

  console.log("savings home: ", savingsWalletAddress, ethers.constants.AddressZero,savingsWalletAddress === ethers.constants.AddressZero)

  if(!savingsWalletAddress || savingsWalletAddress === ethers.constants.AddressZero) {
    return <div className='flex flex-col items-center my-8'>
      {errorMessage && <Alert className='mb-6' variant="destructive">
          <AlertTriangleIcon className="h-4 w-4 text-input mt-1.5" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {errorMessage}.
          </AlertDescription>
        </Alert>}
      <div className="text-sm mb-4">
        No savings wallet found
      </div>
      <Button variant="outline" disabled={isSavingsWalletLoading} isLoading={isSavingsWalletLoading} onClick={handleCreateNewSavingsWallet}>Create new savings wallet</Button>
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
            {isSavingsWalletLoading ? <Skeleton className="bg-white bg-opacity-80 h-7 w-[100px]" /> : <h4 className='w-fit text-lg text-white font-medium '>{savingsWalletBalance}</h4>}
          </div>
          <div className="text-right">
            {isSavingsWalletLoading ? 
              <Skeleton className="bg-white bg-opacity-80 h-5 w-[80px]" /> 
              : <h4 className='w-fit text-md text-white font-medium '>${convertEthToUsd(parseFloat(savingsWalletBalance!), exchangeRate)}</h4>
            }
          </div>
        </div>
      </div>

      <div className="flex w-full gap-3 mb-6">
        <Button variant="outline" className='w-full' disabled={true} >
            Deposit
        </Button>
        <Button variant="outline" className='w-full' onClick={handleWithdraw}>
          Withdraw
        </Button>
      </div>


    </div>
  );
};

export default SavingsHome;
