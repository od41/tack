"use client";
import React, { useState, useContext } from 'react';
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
import { convertEthToUsd, formatAddress } from '@/lib/utils';
import { WalletContext } from '@/app/_components/wallets_context';

const SendEth = () => {
  const [toAddress, setToAddress] = useState('');     // Recipient's address
  const [amount, setAmount] = useState('');           // Amount to send
  const [amountUsd, setAmountUsd] = useState(0);           // Amount to send
  const [amountSavings, setAmountSavings] = useState(0);           // Amount to save
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const {wallet, balance, exchangeRate, savingsWallet, refreshBalance, refreshTransactions } = useContext(WalletContext)
  const { savingsWalletAddress } = savingsWallet



  const sendEth = async (sendAmount: string, sendToAddress: string) => {
    
    try {
      // Connect to an Ethereum node
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
      const walletSigner = new ethers.Wallet(wallet!.privateKey, provider); // TODO Replace with the actual private key
      const amountWei = ethers.utils.parseEther(sendAmount);
      const transaction = await walletSigner.sendTransaction({
        to: sendToAddress,
        value: amountWei,
      });
      // Update state with the transaction hash
      setTransactionHash(transaction!.hash);
    } catch (error) {
      
      setErrorMessage((error as Error).message);
      console.error('Error sending ETH:', (error as Error));
    }
  };

  async function sendEthWithRoundUp(): Promise<void> {
    setIsLoading(true)
    
    const amountInUsd = Number(amount) * exchangeRate;
    const roundedUpAmountInUsd = Math.ceil(amountInUsd);
    const actualAmountInEth = amount;
    const roundedUpAmountInEth = ((roundedUpAmountInUsd - amountInUsd) / exchangeRate).toFixed(12);
    setAmountSavings(parseFloat(roundedUpAmountInEth))
    await sendEth(actualAmountInEth, toAddress);

    if(!savingsWalletAddress) {
      setIsLoading(false)
      if(transactionHash){ 
        setToAddress('')
        setAmount('')
        setAmountUsd(0)
      }
      return
    } else {
      await sendEth(String(roundedUpAmountInEth), savingsWalletAddress);
      setIsLoading(false)
      if(transactionHash){ 
        setToAddress('')
        setAmount('')
        setAmountUsd(0)
      }
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
        {(transactionHash != null && errorMessage == "" && !isLoading)  && <Alert className='mb-6'>
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
              setAmountUsd(Number(convertEthToUsd(parseFloat(e.target.value), exchangeRate)))
              if(e.target.value > balance!) setErrorMessage("Insufficient balance")
              else setErrorMessage("")
              }} />
            {amount && amountUsd && <div className='text-sm font-medium'>${amountUsd}</div>}
        </div>

        <div className='flex items-center gap-3 w-full mt-4'>
          <Button
            className='w-full'
            variant="outline"
            asChild
          >
            <Link href="/wallet">
              Go Back
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
