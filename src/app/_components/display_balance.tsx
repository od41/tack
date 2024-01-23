"use client"
import React, { useState } from 'react';
import { ethers } from 'ethers';

const DisplayBalance = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);

  const checkBalance = async () => {
    try {
      // Connect to an Ethereum node
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);

      // Get the balance of the provided address
      const balanceWei = await provider.getBalance(address);
      
      // Convert the balance from Wei to Ether
      const balanceEth = ethers.utils.formatEther(balanceWei);

      // Update state with the balance
      setBalance(balanceEth);
    } catch (error) {
      console.error('Error fetching balance:', (error as Error).message);
    }
  };

  return (
    <div>
      <h2>Check Balance</h2>
      <label>
        Enter Ethereum Address:
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>
      <button onClick={checkBalance}>Check Balance</button>
      {balance !== null && (
        <div>
          <strong>Balance:</strong> {balance} ETH
        </div>
      )}
    </div>
  );
};

export default DisplayBalance;
