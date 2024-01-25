"use client"
import { Wallet, ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react';
import { Transaction } from '@/app/wallet/_components/transactions_list'; 
import axios from 'axios';

type WalletContextProps = {
    wallet: Wallet | undefined;
    walletAddress: string | undefined;
    balance: string | undefined;
    txList: Transaction[];
    refreshBalance: (address: string) => void;
    refreshTransactions: () => void;
    login: () => void;
    exchangeRate: number;
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
    refreshTransactions: () => {},
    login: () => {},
    exchangeRate: 0, // default value of eth to USD
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
    const [txList, setTxList] = useState<Transaction[]>([])
    const [savingsWalletAddress, setSavingsWalletAddress] = useState<string | undefined>(undefined)
    const [savingsWalletBalance, setSavingsWalletBalance] = useState<string | undefined>(undefined)
    const [exchangeRate, setExchangeRate] = useState(2300)

      async function recoverWalletFromSeed(){
        let recoveredWallet;
        const seedPhrase = process.env.NEXT_PUBLIC_WALLET_1_SEED_PHRASE!
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

      async function login() {
        await recoverWalletFromSeed()
      }

      async function refreshBalance(address: string) {
        if(!wallet || !walletAddress) return;

        try {
            const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
            const balanceWei = await provider.getBalance(walletAddress);
            const balanceEth = ethers.utils.formatEther(balanceWei);
            setBalance(parseFloat(balanceEth).toFixed(4));
          } catch (error) {
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
    
      useEffect(() => {
        login!() // TODO remove and place in login view
      }, [])
    
    return (
        <WalletContext.Provider value={{
            login,
            wallet,
            walletAddress,
            balance,
            txList,
            refreshBalance,
            refreshTransactions,
            exchangeRate,
            savingsWallet: {
                savingsWalletAddress,
                balance: savingsWalletBalance
            }
        }}>
            {children}
        </WalletContext.Provider>
    )
};