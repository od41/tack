import { Button } from '@/components/ui/button'
import React from 'react'
import WalletHome from '../../components/pages/wallet/wallet_home'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SavingsHome from '../../components/pages/wallet/savings_home'
import Link from 'next/link'
import WalletProfile from '../../components/pages/wallet/wallet_profile'

const WalletHomePage = () => {
  return (
    <>
    <WalletProfile />
      <Tabs defaultValue="wallet" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
        </TabsList>
        <TabsContent value="wallet"><WalletHome /></TabsContent>
        <TabsContent value="savings"><SavingsHome /></TabsContent>
      </Tabs>
    </>
  )
}

export default WalletHomePage