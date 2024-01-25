import GenerateWallet from "@/app/new/wallet/_components/generate_wallet"
import DisplayBalance from '@/app/_components/display_balance';
import SendEth from '@/app/wallet/send/_components/send_eth';
import SavingsWalletComponent from "./_components/savings_wallet";

const WelcomePage = () => {
  return (
    <>
      <GenerateWallet />
    </>
  )
}

export default WelcomePage