"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  }, [walletAddress]);

  return (
    <div>
      <h2>Transactions for {walletAddress}</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.hash}>
            <strong>Amount:</strong> {transaction.value} Wei<br />
            <strong>Hash:</strong> <a href={`https://pegasus.lightlink.io/tx/${transaction.hash}`} target="_blank" rel="noopener noreferrer">{transaction.hash}</a><br />
            <strong>Status:</strong> {transaction.txreceipt_status === '1' ? 'Success' : 'Failure'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
