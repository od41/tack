"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { ArrowDownRightIcon, ArrowUpLeftIcon } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import { ethers } from 'ethers';

type TransactionsListProps = {
  walletAddress: string;
}

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

const TransactionList = ({ walletAddress }: TransactionsListProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const EXCHANGE_RATE = 2300;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Replace 'YOUR_BLOCKSCOUT_API_URL' with the actual BlockScout API URL
        const blockscoutApiUrl = `https://pegasus.lightlink.io/api?module=account&action=txlist&address=${walletAddress}`;

        const response = await axios.get(blockscoutApiUrl);
        const transactionsData = response.data.result;

        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching transactions:', (error as Error).message);
      }
    };

    if (walletAddress) {
      fetchTransactions();
    }

    console.log(transactions)
  }, [walletAddress]);

  function isDeposit(tx: Transaction): boolean{
   if(tx.to === walletAddress) return true;
   return false
  }

  const convertWeiToUsd = (weiAmount: number, ethPriceInUsd: number): number => {
    const ethAmount = ethers.utils.formatUnits(weiAmount, 'ether');
    const usdValue = parseFloat(ethAmount) * ethPriceInUsd;
    return usdValue;
};

  return (
    <>
      <ScrollArea className="h-72 w-full rounded-md border">
        {transactions.map((tx) => (
          <Link key={tx.hash} href={`https://pegasus.lightlink.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className='hover:bg-accent-2 mb-2'>

            <div className='flex w-full items-center hover:bg-[#E0DAD4] px-1.5 pr-3 py-1.5 mb-0.5 rounded-md justify-between'>
              <div className='flex items-center'>

                {!isDeposit(tx) ? <ArrowUpLeftIcon className="w-5 rounded-full p-0.5 text-red-400 bg-red-300/30 sm" /> : <ArrowDownRightIcon className="w-5  p-0.5 text-green-600 bg-green-400/20 sm" />}

                <div className="ml-3">
                  <div className='text-sm font-bold'>
                    Deposit
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
                  ${convertWeiToUsd(tx.value, EXCHANGE_RATE).toFixed(2)}
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
