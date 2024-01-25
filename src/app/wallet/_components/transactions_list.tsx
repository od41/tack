"use client"
import React, { useContext } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { ArrowDownRightIcon, ArrowUpLeftIcon } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import { ethers } from 'ethers';
import { WalletContext } from '@/app/_components/wallets_context';

export type Transaction = {
  blockHash: string;
  blockNumber: number;
  from: string;
  to: string;
  hash: string;
  nonce: number;
  timeStamp: number;
  value: number;
  txreceipt_status: string;
}

const TransactionList = () => {
  const {walletAddress, txList, exchangeRate } = useContext(WalletContext)

  function isDeposit(tx: Transaction): boolean{
   return (tx.to).toLowerCase() === walletAddress!.toLowerCase()
  }

  const convertWeiToUsd = (weiAmount: number, ethPriceInUsd: number): number => {
    const ethAmount = ethers.utils.formatUnits(weiAmount, 'ether');
    const usdValue = parseFloat(ethAmount) * ethPriceInUsd;
    return usdValue;
};

  return (
    <>
      <ScrollArea className="h-72 w-full rounded-md border">
        {txList!.map((tx) => (
          <Link key={tx.hash} href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_LINK!}tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className='hover:bg-accent-2 mb-2'>

            <div className='flex w-full items-center hover:bg-[#E0DAD4] px-1.5 pr-3 py-1.5 mb-0.5 rounded-md justify-between'>
              <div className='flex items-center'>

                {isDeposit(tx) ? <ArrowDownRightIcon className="w-5  p-0.5 text-green-600 bg-green-400/20 sm" /> : <ArrowUpLeftIcon className="w-5 rounded-full p-0.5 text-red-400 bg-red-300/30 sm" />}

                <div className="ml-3">
                  <div className='text-sm font-bold'>
                    {isDeposit(tx) ? <>Receive</> : <>Send</>}
                  </div> 
                  <div className='text-[10px] mt-0.5'>
                    {formatDuration(tx.timeStamp)}
                  </div>
                </div>

              </div>

              <div className='text-right'>
                <div className='font-bold text-sm'>
                  {ethers.utils.formatEther(tx.value)} <span>ETH</span>
                </div>
                <div className="text-[10px] mt-0.5">
                  ${convertWeiToUsd(tx.value, exchangeRate).toFixed(2)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </ScrollArea>
    </>
  );
};

export default TransactionList;
