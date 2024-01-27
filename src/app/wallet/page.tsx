import { Button } from '@/components/ui/button'
import React from 'react'
import WalletHome from './_components/wallet_home'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SavingsHome from './_components/savings_home'
import Link from 'next/link'
import WalletProfile from './_components/wallet_profile'

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