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
  createNewSavingsWallet: (numberOfDays: number) => Promise<void>;
  withdrawSavings: () => Promise<void>;
  errorMessage: string | undefined;
  savingsWallet: {
    savingsWalletAddress: string | undefined;
    balance: string | undefined;
    isLoading: boolean;
    withdrawalDateTimestamp: number;
    withdrawalError: string
  };
}

const defaultData: WalletContextProps = {
  wallet: undefined,
  walletAddress: undefined,
  balance: undefined,
  txList: [],
  refreshBalance: (address: string) => { },
  isBalanceLoading: false,
  refreshTransactions: () => { },
  login: async () => false,
  generateWallet: async () => false,
  logout: () => { },
  recover: () => { },
  exchangeRate: 0, // default value of eth to USD
  createNewSavingsWallet: async () => { },
  withdrawSavings: async () => { },
  errorMessage: undefined,
  savingsWallet: {
    savingsWalletAddress: undefined,
    balance: undefined,
    isLoading: false,
    withdrawalDateTimestamp: 0,
    withdrawalError: ""
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
  const [withdrawalDateTimestamp, setWithdrawalDateTimestamp] = useState(0)
  const [isSavingsWalletLoading, setIsSavingsWalletLoading] = useState(false)
  const [withdrawalError, setWithdrawalError] = useState("")


  const [errorMessage, setErrorMessage] = useState("")

  const AVERAGE_BLOCKTIME = 0.505; // in seconds

  async function login(password: string) {
    if (password) {
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
    if (password && seedPhrase) {
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
    } catch (err) {
      console.error('Recovery of wallet failed')
      return;
    }
    setWallet(recoveredWallet);
    setWalletAddress(recoveredWallet.address);
    await refreshBalance(recoveredWallet.address)
  }

  async function refreshBalance(address: string) {
    setIsBalanceLoading(true)
    if (!wallet || !walletAddress) {
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
    if (!walletAddress) return
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

  function calculateWithdrawalDate(days: number): number {
    const daysInSeconds = days * 24 * 60 * 60;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const futureTimestamp = currentTimestamp + daysInSeconds;
    return futureTimestamp;
  }

  async function createNewSavingsWallet(numberOfDays = 30) {
    // get the signer
    // get the contract 
    // call the createSavingsWallet function
    // store it in state 

    if (!wallet) {
      // show a message
      return
    }
    setIsSavingsWalletLoading(true)

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
    const walletSigner = new ethers.Wallet(wallet!.privateKey, provider);

    const factoryContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_SAVINGS_WALLET_FACTORY_ADDRESS!,
      factoryContractABI,
      walletSigner
    );

    try {
      setErrorMessage("");
      const tx = await factoryContract!.createSavingsWallet(numberOfDays); 
      await tx.wait()
      const _savingsWalletAddress = await factoryContract!.ownersToWallets(walletAddress);
      console.log('New Savings Wallet deployed at:', _savingsWalletAddress); // TODO display the savings wallet address to the user
      setSavingsWalletAddress(_savingsWalletAddress);

      // get savings balance
      const balanceWei = await provider.getBalance(_savingsWalletAddress);
      const balanceEth = ethers.utils.formatEther(balanceWei);
      setSavingsWalletBalance(balanceEth);

      // get withdrawal date
      const savingsWalletContract = new ethers.Contract(
        _savingsWalletAddress,
        savingsContractABI,
        provider
      );
      const _withdrawalDate = await savingsWalletContract!.getNextWithdrawalTimestamp();
      setWithdrawalDateTimestamp(_withdrawalDate.toNumber());
      
      setIsSavingsWalletLoading(false)
    } catch (error) {
      // @ts-ignore
      let message = (error as Error).error.reason
      message = message.substring("execution reverted: ".length)
      setErrorMessage(message);
      setIsSavingsWalletLoading(false)

    }
  }

  async function getSavingsWallet() {
    // get the signer
    // get the contract object
    // use walletAddress to load up the savings wallet
    // store savings wallet in state
    // get balance of savings wallet
    // get withdrawal date of savings wallet
    setIsSavingsWalletLoading(true)

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
    const factoryContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_SAVINGS_WALLET_FACTORY_ADDRESS!,
      factoryContractABI,
      provider
    );

    // get savings wallet address
    const _savingsWalletAddress = await factoryContract!.ownersToWallets(walletAddress);
    setSavingsWalletAddress(_savingsWalletAddress)

    if (_savingsWalletAddress === ethers.constants.AddressZero) {
      setIsSavingsWalletLoading(false)
      return
      throw Error("Wallet doesn't exist")
    }


    // get savings balance
    const balanceWei = await provider.getBalance(_savingsWalletAddress);
    const balanceEth = ethers.utils.formatEther(balanceWei);
    setSavingsWalletBalance(balanceEth);

    // get withdrawal date
    const savingsWalletContract = new ethers.Contract(
      _savingsWalletAddress,
      savingsContractABI,
      provider
    );
    const _withdrawalDate = await savingsWalletContract!.getNextWithdrawalTimestamp();
    setWithdrawalDateTimestamp(_withdrawalDate.toNumber());

    setIsSavingsWalletLoading(false)
  }

  // withdraw from the savings to your own wallet
  async function withdrawSavings() {
    setWithdrawalError('')
    if(!savingsWalletAddress || savingsWalletAddress === ethers.constants.AddressZero) {
      throw Error("Savings wallet doesn't exist")
    }

    if(!walletAddress || walletAddress === ethers.constants.AddressZero) {
      throw Error("No wallet detected")
    }
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
    const walletSigner = new ethers.Wallet(wallet!.privateKey, provider);

    const savingsWalletContract = new ethers.Contract(
      savingsWalletAddress,
      savingsContractABI,
      walletSigner
    );

    try {
      const tx = await savingsWalletContract.withdraw();
      await tx.wait()
      await refreshBalance(walletAddress!)
      await refreshTransactions()
    } catch (error) {
      // @ts-ignore
      let message = (error as Error).error.reason
      message = message.substring("execution reverted: ".length)
      console.error('something went wrong', message)
      setWithdrawalError(message)
    }
  }

  useEffect(() => {
    // non-custodial wallet balance and transactions
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
    let lastBalance = ethers.constants.Zero;

    if (walletAddress) {
      const checkTransactionsAndBalance = async () => {
        try {
          const balance = await provider.getBalance(walletAddress);
          if (!balance.eq(lastBalance)) {
            lastBalance = balance;
            const balanceInEth = ethers.utils.formatEther(balance);
            console.log(`Non-custodial Balance: ${balanceInEth} ETH`);
            setBalance(balanceInEth);
            refreshTransactions(); // refresh transactions
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };

      const blockListener = () => {
        provider.on('block', checkTransactionsAndBalance);
      };

      blockListener(); // Initial call
      // Cleanup function to remove the listener when component unmounts
      return () => {
        provider.removeListener('block', checkTransactionsAndBalance);
      };
    }
}, [walletAddress]);

useEffect(() => {
  // savings wallet balance
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LIGHTLINK_TESTNET_URL);
  let lastBalance = ethers.constants.Zero;

  if (savingsWalletAddress && savingsWalletAddress !== ethers.constants.AddressZero) {
    const checkBalance = async () => {
      try {
        const balance = await provider.getBalance(savingsWalletAddress);
        if (!balance.eq(lastBalance)) {
          lastBalance = balance;
          const balanceInEth = ethers.utils.formatEther(balance);
          console.log(`Balance: ${balanceInEth} ETH`);
          setSavingsWalletBalance(balanceInEth);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    const blockListener = () => {
      provider.on('block', checkBalance);
    };

    blockListener(); // Initial call
    // Cleanup function to remove the listener when component unmounts
    return () => {
      provider.removeListener('block', checkBalance);
    };
  }
}, [savingsWalletAddress]);

  useEffect(() => {
    if (walletAddress) {

      const fetchData = async () => {
        await refreshBalance(walletAddress!)
        setExchangeRate(await fetchEthPriceInUsd());
        await refreshTransactions()
        await getSavingsWallet()
      }
      fetchData()
    }
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
      errorMessage,
      withdrawSavings,
      savingsWallet: {
        savingsWalletAddress,
        balance: savingsWalletBalance,
        isLoading: isSavingsWalletLoading,
        withdrawalDateTimestamp,
        withdrawalError
      }
    }}>
      {children}
    </WalletContext.Provider>
  )
};