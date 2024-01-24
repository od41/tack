"use client";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { LightbulbIcon, AlertTriangleIcon  } from 'lucide-react';
import { formatAddress } from '@/lib/utils';

const SendEth = ({walletAddress}: {walletAddress: string}) => {
  const [toAddress, setToAddress] = useState('');     // Recipient's address
  const [amount, setAmount] = useState('');           // Amount to send
  const [amountUsd, setAmountUsd] = useState(0);           // Amount to send
  const [amountSavings, setAmountSavings] = useState(0);           // Amount to save
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [exchangeRate, setExchangeRate] = useState(2300)
  const [balance, setBalance] = useState<string | null>(null);


  const sendEth = async (sendAmount: string, sendToAddress: string) => {
    
    try {
      // Connect to an Ethereum node
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
      // Set up the wallet for the sender
      const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_TEST_WALLET_PK_1!, provider); // Replace with the actual private key
      // Convert the amount to Wei
      const amountWei = ethers.utils.parseEther(sendAmount);
      // Send the transaction
      const transaction = await wallet.sendTransaction({
        to: sendToAddress,
        value: amountWei,
      });
      // Update state with the transaction hash
      setTransactionHash(transaction.hash);
    } catch (error) {
      
      setErrorMessage((error as Error).message);
      console.log('Error sending ETH:', (error as Error));
    }
  };

  useEffect(() => {
    const fetchRate = async () => {
      setExchangeRate(await fetchEthPriceInUsd());
      await checkBalance()
    }
    fetchRate();
  }, [])


  const checkBalance = async () => {
    try {
      // Connect to an Ethereum node
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
      const balanceWei = await provider.getBalance(walletAddress);
      const balanceEth = ethers.utils.formatEther(balanceWei);
      setBalance(balanceEth);
      console.log('fetching balance', balance)
    } catch (error) {
      console.error('Error fetching balance:', (error as Error).message);
    }
  };
  

  const fetchEthPriceInUsd = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    return data.ethereum.usd;
  };

  async function sendEthWithRoundUp(): Promise<void> {
    setIsLoading(true)
    const walletContractAddress = '0x2cd091664f0183c1978b3ea9b8bb3dc8c3eefd7c'; // @TODO get this address from state
    
    const amountInUsd = Number(amount) * exchangeRate;
    const roundedUpAmountInUsd = Math.ceil(amountInUsd);
    const actualAmountInEth = amount;
    const roundedUpAmountInEth = ((roundedUpAmountInUsd - amountInUsd) / exchangeRate).toFixed(12);
    setAmountSavings(parseFloat(roundedUpAmountInEth))
    await sendEth(actualAmountInEth, toAddress);
    await sendEth(String(roundedUpAmountInEth), walletContractAddress);
    setIsLoading(false)
    if(transactionHash){ 
      setToAddress('')
      setAmount('')
      setAmountUsd(0)
    }
  }

  return (
    <>
      <div className='flex flex-col items-center w-full mx-auto my-8'>
        {errorMessage && <Alert className='mb-6' variant="destructive">
          <AlertTriangleIcon className="h-4 w-4 text-input mt-1.5" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {errorMessage}.
          </AlertDescription>
        </Alert>}
        {(transactionHash != null && errorMessage == "")  && <Alert className='mb-6'>
          <LightbulbIcon className="h-4 w-4 text-input mt-1.5" />
          <AlertTitle>Send Complete!</AlertTitle>
          <AlertDescription>
            You've just sent {amount}ETH (${amountUsd}) to {formatAddress(toAddress)} and saved {amountSavings.toFixed(4)}ETH (${(amountSavings * exchangeRate).toFixed(2)})
          </AlertDescription>
        </Alert>}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="recipient" className='section-heading'>Recipient Address</Label>
          <Input type="recipient" id="recipient" placeholder={`E.g ${formatAddress("0x12300000000000000000000000000000000000789")}`} value={toAddress}
            onChange={(e) => setToAddress(e.target.value)} />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
          <div className="flex w-full justify-between">
            <Label htmlFor="amount" className='section-heading'>Amount (ETH)</Label>
            <Label htmlFor="" className='section-heading text-stroke'>Your Bal: {parseFloat(balance!).toFixed(4)} ETH</Label>
          </div>
          <Input type="amount" id="amount" placeholder="E.g 10" value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              const valueInUsd = (parseFloat(e.target.value) * exchangeRate).toFixed(2);
              setAmountUsd(Number(valueInUsd))
              if(e.target.value > balance!) setErrorMessage("Insufficient balance")
              else setErrorMessage("")
              }} />
            {amount && amountUsd && <div className='text-sm font-medium'>${amountUsd}</div>}
        </div>

        <div className='flex items-center gap-3 w-full mt-4'>
          <Button
            className='w-full'
            variant="outline"
          >
            <Link href="/wallet">
              Cancel
            </Link>
          </Button>
          <Button
            className='w-full'
            disabled={toAddress == "" || amount == "" || isLoading || errorMessage != ""}
            isLoading={isLoading}
            onClick={(e: any) => {
              e.preventDefault();
              sendEthWithRoundUp();
            }}
          >Send</Button>
        </div>

      </div>
    </>
  );
};

export default SendEth;