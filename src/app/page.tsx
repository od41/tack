import GenerateWallet from "@/app/_components/generate_wallet"
import DisplayBalance from '@/app/_components/display_balance';
import SendEth from '@/app/_components/send_eth';
import TransactionList from "./_components/transactions_list";
import SavingsWalletComponent from "./_components/savings_wallet";

const WelcomePage = () => {
  return (
    <>
      <GenerateWallet />

      {/* <hr />
      <DisplayBalance />

      <hr />
      <SendEth />

      <hr />
      <TransactionList walletAddress="0xfcb6ee26891fcd71ca0884b2b8a989fbdc4b2628" />

      <hr />
      <SavingsWalletComponent /> */}
    </>
  )
}

export default WelcomePage