"use client"
import { Wallet, ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react';
import { Transaction } from '@/app/wallet/_components/transactions_list'; 
import axios from 'axios';
import savingsContractABI from '@/abi/savings.json'
import factoryContractABI from '@/abi/factory.json'

type WalletContextProps = {
    wallet: Wallet | undefined;
    walletAddress: string | undefined;
    balance: string | undefined;
    txList: Transaction[];
    refreshBalance: (address: string) => void;
    isBalanceLoading: boolean;
    refreshTransactions: () => void;
    login: (password: string) => Promise<boolean>;
    generateWallet: (password: string, seedPhrase: string) => Promise<boolean>;
    logout: () => void;
    recover: (seedPhrase: string) => void;
    exchangeRate: number;
    createNewSavingsWallet: () => Promise<void>;
    savingsWallet: {
        savingsWalletAddress: string | undefined;
        balance: string | undefined;
    };
}

const defaultData: WalletContextProps = {
    wallet: undefined,
    walletAddress: undefined,
    balance: undefined,
    txList: [],
    refreshBalance: (address: string) => {},
    isBalanceLoading: false,
    refreshTransactions: () => {},
    login: async () => false,
    generateWallet: async () => false,
    logout: () => {},
    recover: () => {},
    exchangeRate: 0, // default value of eth to USD
    createNewSavingsWallet: async () => {},
    savingsWallet: {
        savingsWalletAddress: undefined,
        balance:  undefined,
    },
}
export const WalletContext = createContext(defaultData)

const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BLOCKSCOUT_API_KEY}`
    }
  });

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [wallet, setWallet] = useState<Wallet | undefined>(undefined)
    const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined)
    const [balance, setBalance] = useState<string | undefined>(undefined)
    const [isBalanceLoading, setIsBalanceLoading] = useState(false)
    const [txList, setTxList] = useState<Transaction[]>([])
    const [savingsWalletAddress, setSavingsWalletAddress] = useState<string | undefined>(undefined)
    const [savingsWalletBalance, setSavingsWalletBalance] = useState<string | undefined>(undefined)
    const [exchangeRate, setExchangeRate] = useState(2300)
    const [encryptedJson, setEncryptedJson] = useState<any>(undefined)

      async function login(password: string) {
        if(password) {
          const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password) // TODO find a way to load the json object from somewhere...
          setWallet(wallet)
          setWalletAddress(wallet.address)
          await refreshBalance(wallet.address)
          return true
        }
        return false
      }

      function progress(progress: number) {
        console.log("Encrypting: " + progress + "% complete");
    }

      async function generateWallet(password: string, seedPhrase: string) {
        if(password && seedPhrase) {
          const wallet = ethers.Wallet.fromMnemonic(seedPhrase)
          let _encryptedJson = await wallet.encrypt(password, progress);

          // TODO find a way to load the json object from somewhere else...
          setEncryptedJson(_encryptedJson)
          setWallet(wallet)
          setWalletAddress(wallet.address)
          await refreshBalance(wallet.address)
          return true
          
        }
        return false
      }

      function logout() {
        setWallet(undefined)
        setWalletAddress(undefined)
        setBalance(undefined)
        setTxList([])
        setSavingsWalletAddress(undefined)
        setSavingsWalletBalance(undefined)
        
      }

      async function recover(seedPhrase: string) {
        let recoveredWallet;
        try {
          recoveredWallet = ethers.Wallet.fromMnemonic(seedPhrase);
        }catch(err){
          console.error('Recovery of wallet failed')
          return;
        }
        setWallet(recoveredWallet);
        setWalletAddress(recoveredWallet.address);
        await refreshBalance(recoveredWallet.address)
      }

      async function refreshBalance(address: string) {
        setIsBalanceLoading(true)
        if(!wallet || !walletAddress) {
          setIsBalanceLoading(false)
          return
        };

        try {
            const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
            const balanceWei = await provider.getBalance(walletAddress);
            const balanceEth = ethers.utils.formatEther(balanceWei);
            setBalance(parseFloat(balanceEth).toFixed(4));
            setIsBalanceLoading(false)
          } catch (error) {
            setIsBalanceLoading(false)
            console.error('Error fetching balance:', (error as Error).message);
          }
      }

      async function refreshTransactions() {
        if(!walletAddress) return
        try {
            const blockscoutApiUrl = `https://pegasus.lightlink.io/api?module=account&action=txlist&address=${walletAddress}`;
    
            const response = await axiosInstance.get(blockscoutApiUrl);
            const transactionsData = response.data.result;
    
            setTxList(transactionsData);
          } catch (error) {
            console.error('Error fetching transactions:', (error as Error).message);
          }
      }

      const fetchEthPriceInUsd = async () => {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        return data.ethereum.usd;
      };

      async function createNewSavingsWallet() {
        // get the signer
        // get the contract 
        // call the createSavingsWallet function
        // store it in state 

        if (!wallet) return

        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
        const walletSigner = new ethers.Wallet(wallet!.privateKey, provider);

        const factoryContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_SAVINGS_WALLET_FACTORY_ADDRESS ?,
          factoryContractABI,
          walletSigner
        );

        try {
          await factoryContract!.createSavingsWallet(15); // TODO take date in the future and turn it into an unsigned integer
          const accounts = await wallet!.getAddress();
          const walletAddress = await factoryContract!.savingsWallets(accounts);
          console.log('New Savings Wallet deployed at:', walletAddress);
          setWalletAddress(walletAddress);
        } catch (error) {
          console.error('Error creating Savings Wallet:', error);
        }
      }

      async function getSavingsWallet() {
        // get the signer
        // get the contract object
        // use walletAddress to load up the savings wallet
        // store savings wallet in state
        // get balance of savings wallet
        // get withdrawal date of savings wallet
        // const newWalletContract = new ethers.Contract(
        //   walletContractAddress,
        //   savingsContractABI,
        //   newWallet
        // );
      //   try {
      //     const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
  
      //   // Get the balance of the provided address
      //   const balanceWei = await provider.getBalance(walletContractAddress);
        
      //   // convert the balance from Wei to Ether
      //   const balanceEth = ethers.utils.formatEther(balanceWei);
      //   setBalance(balanceEth);
  
      //   // Replace with your method to get withdrawal date
      //   const withdrawalDate = await walletContract!.getWithdrawalDate();
      //   setWithdrawalDate(withdrawalDate);
      // } catch (error) {
      //   console.error('Error getting Wallet info:', error);
      // }
      }

      useEffect(() => {
        const fetchTransactions = async () => {
          await refreshTransactions()
        };

        fetchTransactions();
      }, [walletAddress]);

      useEffect(() => {
        const fetchData = async () => {
          await refreshBalance!(walletAddress!)
          setExchangeRate(await fetchEthPriceInUsd());
        }
        fetchData()
      }, [walletAddress])
    
    return (
        <WalletContext.Provider value={{
            login,
            generateWallet,
            logout,
            recover,
            wallet,
            walletAddress,
            balance,
            txList,
            refreshBalance,
            isBalanceLoading,
            refreshTransactions,
            exchangeRate,
            createNewSavingsWallet,
            savingsWallet: {
                savingsWalletAddress,
                balance: savingsWalletBalance
            }
        }}>
            {children}
        </WalletContext.Provider>
    )
};