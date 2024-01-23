"use client";
import React, { useState } from 'react';
import { ethers } from 'ethers';

const SendEth = () => {
  const [fromAddress, setFromAddress] = useState(''); // Sender's address
  const [toAddress, setToAddress] = useState('');     // Recipient's address
  const [amount, setAmount] = useState('');           // Amount to send
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

function generateAddressFromPrivateKey(privateKey: string) {
  try {
    // Ensure the private key is a valid hex string
    if (!ethers.utils.isHexString(privateKey) || privateKey.length !== 66) {
      throw new Error('Invalid private key format');
    }

    // Create a wallet using the provided private key
    const wallet = new ethers.Wallet(privateKey);

    // Get the Ethereum address
    const address = wallet.address;

    return address;
  } catch (error) {
    console.error('Error generating address from private key:', (error as Error).message);
    return null;
  }
}

  const sendEth = async (sendAmount: string, sendToAddress: string) => {
    try {
      // Connect to an Ethereum node
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
      const pk_very_unsafe = process.env.NEXT_PUBLIC_TEST_WALLET_PK_1
      const from = generateAddressFromPrivateKey(pk_very_unsafe!)
      setFromAddress(from ? from : '' )
      // Set up the wallet for the sender
      const wallet = new ethers.Wallet(pk_very_unsafe!, provider); // Replace with the actual private key

      
      // Convert the amount to Wei
      const amountWei = ethers.utils.parseEther(sendAmount);
      console.log('sending: ', sendAmount, "ETH to: ", sendToAddress)
      console.log('sending: ', amountWei.toString(), "Wei")

      // Send the transaction
      const transaction = await wallet.sendTransaction({
        to: sendToAddress,
        value: amountWei,
      });

      // Update state with the transaction hash
      setTransactionHash(transaction.hash);
    } catch (error) {
      console.error('Error sending ETH:', (error as Error).message);
    }
  };

  const fetchEthPriceInUsd = async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      return data.ethereum.usd;
  };

  async function sendEthWithRoundUp(): Promise<void> {
    const walletContractAddress = '0x2cd091664f0183c1978b3ea9b8bb3dc8c3eefd7c';
    const ethToUsdConversionRate = await fetchEthPriceInUsd();
    console.log('exchange rate', ethToUsdConversionRate)
    const amountInUsd = Number(amount) * ethToUsdConversionRate;
    const roundedUpAmountInUsd = Math.ceil(amountInUsd);
    const actualAmountInEth = amount;
    const roundedUpAmountInEth = ((roundedUpAmountInUsd - amountInUsd) / ethToUsdConversionRate).toFixed(12);
    console.log('rounded up amount',roundedUpAmountInEth)
    await sendEth(actualAmountInEth, toAddress);
    await sendEth(String(roundedUpAmountInEth), walletContractAddress);
}

  return (
    <div>
      <h2>Send ETH</h2>
      <label>
        From Address:
        <input
          type="text"
          defaultValue={fromAddress}
          onChange={(e) => setFromAddress(e.target.value)}
          readOnly
        />
      </label>
      <label>
        To Address:
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
      </label>
      <label>
        Amount (ETH):
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <button onClick={(e: any) => {
        e.preventDefault()
        sendEthWithRoundUp()
        }}>Send ETH</button>
      {transactionHash && (
        <div>
          <strong>Transaction Hash:</strong> {transactionHash}
        </div>
      )}
    </div>
  );
};

export default SendEth;
