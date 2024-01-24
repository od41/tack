"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { ArrowDownRightIcon } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

type TransactionsListProps = {
  walletAddress: string;
}

export type Transaction = {
  blockHash: string;
  blockNumber: number;
  from: string;
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

  return (
    <>
      <ScrollArea className="h-72 w-full rounded-md border">
        {transactions.map((tx) => (
          <Link key={tx.hash} href={`https://pegasus.lightlink.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">

            <div className='flex gap-3 w-full items-center'>
              <ArrowDownRightIcon />

              <div className="p">
                <div>
                  Deposit
                </div> 
                <div className='text-xs'>
                  {formatDuration(tx.timeStamp)}
                </div>
              </div>

              <div>
                {tx.value}
                {tx.value * EXCHANGE_RATE}
              </div>
              {tx.hash}
            </div>
          </Link>
        ))}
      </ScrollArea>
    </>
  );
};

export default TransactionList;
