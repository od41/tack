"use client"
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton"
import { WalletContext } from '@/app/_components/wallets_context';
import { convertEthToUsd } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangleIcon, LightbulbIcon } from 'lucide-react';
import { ethers } from 'ethers';

type CountdownProps = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}


const SavingsHome = () => {
  const { exchangeRate, withdrawSavings, savingsWallet, createNewSavingsWallet, errorMessage } = useContext(WalletContext)
  const [canWithdraw, setCanWithdraw] = useState(false)
  const [countdown, setCountdown] = useState<CountdownProps>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [withdrawalLoading, setWithdrawalLoading] = useState(false)
  const [withdrawalMessage, setWithdrawalMessage] = useState("")

  const {
    savingsWalletAddress,
    balance: savingsWalletBalance,
    isLoading: isSavingsWalletLoading,
    withdrawalDateTimestamp,
    withdrawalError
} = savingsWallet

  function handleCreateNewSavingsWallet() {
    // create a withdrawal date of 15 days
    const DEFAULT_WITHDRAWAL_DATE = 15
    createNewSavingsWallet(DEFAULT_WITHDRAWAL_DATE) 
  }

  async function handleWithdraw(e: any) {
    e.preventDefault()
    setWithdrawalLoading(true)
    setWithdrawalMessage('')
    
    // make a call to the 
    await withdrawSavings()
    setWithdrawalMessage(`You've just withdrawn ${savingsWalletBalance}ETH ($${(Number(savingsWalletBalance) * exchangeRate).toFixed(2)}).`)
    setWithdrawalLoading(false)
    
  }

  console.log("savings home: ", savingsWalletAddress, ethers.constants.AddressZero,savingsWalletAddress === ethers.constants.AddressZero)

  const calculateTimeRemaining = (futureTime: number) => {
    const currentTime = Math.floor(Date.now()/1000); // Current time in seconds
    const timeDifference = futureTime - currentTime;

    if (timeDifference <= 0) {
      // Target date has passed
      setCanWithdraw(true)
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    } else {
      const days = Math.floor(timeDifference / (60 * 60 * 24));
      const hours = Math.floor((timeDifference % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((timeDifference % (60 * 60)) / 60);
      const seconds = Math.floor(timeDifference % 60);
      
      setCanWithdraw(false)
      setCountdown({ days, hours, minutes, seconds })
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      calculateTimeRemaining(withdrawalDateTimestamp)
    }, 1000);

    return () => clearInterval(intervalId);
  }, [withdrawalDateTimestamp])
  

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
        {withdrawalError && <Alert className='mb-6' variant="destructive">
          <AlertTriangleIcon className="h-4 w-4 text-input mt-1.5" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {withdrawalError}.
          </AlertDescription>
        </Alert>}
        {(withdrawalMessage != "" && withdrawalError == "" && !withdrawalLoading)  && <Alert className='mb-6'>
          <LightbulbIcon className="h-4 w-4 text-input mt-1.5" />
          <AlertTitle>Withdrawal Complete!</AlertTitle>
          <AlertDescription>
            {withdrawalMessage}
          </AlertDescription>
        </Alert>}
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
        <Button variant="outline" className='w-full'
          // disabled={!canWithdraw} 
          disabled={withdrawalLoading || !canWithdraw}
          isLoading={withdrawalLoading}
          onClick={handleWithdraw}>
          Withdraw
        </Button>
      </div>

      {!canWithdraw &&<div className="text-sm bg-stroke bg-opacity-20 border-white/50 border p-3 rounded-lg backdrop-blur-lg">
           <div className='flex w-full justify-between'>
            <div className="flex flex-col items-center">
              <div className='text-2xl'>{countdown.days}</div>
              <div className='uppercase text-[10px] tracking-wider'>Days</div>
            </div>
            <div className="flex flex-col items-center">
              <div className='text-2xl text-muted'>{countdown.hours}</div>
              <div className='uppercase text-[10px] tracking-wider'>hours</div>
            </div>
            <div className="flex flex-col items-center">
              <div className='text-2xl text-muted'>{countdown.minutes}</div>
              <div className='uppercase text-[10px] tracking-wider'>minutes</div>
            </div>
            <div className="flex flex-col items-center">
              <div className='text-2xl text-muted'>{countdown.seconds}</div>
              <div className='uppercase text-[10px] tracking-wider'>seconds</div>
            </div>
          </div>
        </div>}


    </div>
  );
};

export default SavingsHome;
