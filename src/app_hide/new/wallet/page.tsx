import { Button } from '@/components/ui/button'
import React from 'react'
import GenerateWallet from './_components/generate_wallet'

const CreateWalletPage = () => {
  return (
    <>
      <h2 className="text-lg font-bold text-center my-4">
        Create wallet
      </h2>

      <GenerateWallet />

      
    </>
  )
}

export default CreateWalletPage