"use client"
import React, { useState, useEffect } from 'react';
import { ethers, type Wallet, type Contract } from 'ethers';
import savingsContractABI from '@/abi/savings.json'
import factoryContractABI from '@/abi/factory.json'

const SavingsWalletComponent = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [factoryContract, setFactoryContract] = useState<Contract | null>(null);
  const [walletContract, setWalletContract] = useState<Contract | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [balance, setBalance] = useState("0");
  const [withdrawalDate, setWithdrawalDate] = useState(0);

  const factoryContractAddress = '0x9B233DC10BCe118fdFc3797Ac928e50f2303eBf8';
  const walletContractAddress = '0x2cd091664f0183c1978b3ea9b8bb3dc8c3eefd7c';

  useEffect(() => {
    const initWallet = async () => {
      const privateKey = process.env.NEXT_PUBLIC_TEST_WALLET_PK_1; // Replace with your private key
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
      const newWallet = new ethers.Wallet(privateKey!, provider);

      // Replace with your SavingsWalletFactory and SavingsWallet contract addresses

      const newFactoryContract = new ethers.Contract(
        factoryContractAddress,
        factoryContractABI,
        newWallet
      );

      const newWalletContract = new ethers.Contract(
        walletContractAddress,
        savingsContractABI,
        newWallet
      );

      setWallet(newWallet);
      setFactoryContract(newFactoryContract);
    //   setWalletContract(newWalletContract);
      setWalletAddress(walletContractAddress);
    };

    initWallet();
  }, []);

  const createSavingsWallet = async () => {
    try {
        alert('creating new savings')
      await factoryContract!.createSavingsWallet(15);
      const accounts = await wallet!.getAddress();
      const walletAddress = await factoryContract!.savingsWallets(accounts);
      console.log('New Savings Wallet deployed at:', walletAddress);
      setWalletAddress(walletAddress);
    } catch (error) {
      console.error('Error creating Savings Wallet:', error);
    }
  };

  const getWalletInfo = async () => {
    try {
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);

      // Get the balance of the provided address
      const balanceWei = await provider.getBalance(walletContractAddress);
      
      // convert the balance from Wei to Ether
      const balanceEth = ethers.utils.formatEther(balanceWei);
      setBalance(balanceEth);

      // Replace with your method to get withdrawal date
      const withdrawalDate = await walletContract!.getWithdrawalDate();
      setWithdrawalDate(withdrawalDate);
    } catch (error) {
      console.error('Error getting Wallet info:', error);
    }
  };

  const withdrawFunds = async () => {
    try {
      await walletContract!.withdraw({ gasLimit: 3000000 });
      console.log('Withdrawal successful');
      // You might want to update the balance and withdrawal date here
    } catch (error) {
      console.error('Error withdrawing funds:', error);
    }
  };

  useEffect(() => {
    if (walletAddress !== '') {
      getWalletInfo();
    }
  }, [walletAddress]);

  return (
    <div>
      <button onClick={createSavingsWallet} disabled={isButtonDisabled}>
        New Savings Wallet
      </button>
      <div>
        <p>Balance: {balance} ETH</p>
        {withdrawalDate > Date.now() ? (
          <p>Withdrawal Date: {new Date(withdrawalDate * 1000).toLocaleDateString()}</p>
        ) : (
          <button onClick={withdrawFunds}>Withdraw</button>
        )}
      </div>
    </div>
  );
};

export default SavingsWalletComponent;
