import GenerateWallet from "@/app/new/wallet/_components/generate_wallet"
import DisplayBalance from '@/app/_components/display_balance';
import SendEth from '@/app/_components/send_eth';
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