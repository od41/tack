"use client"
import { WalletContext } from '@/app/_components/wallets_context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatAddress } from '@/lib/utils'
import React, { useContext } from 'react'

const WalletProfile = () => {
  const {walletAddress} = useContext(WalletContext)

    return (
        <>
            <div className="flex items-center mb-4">

                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>Wallet</AvatarFallback>
                </Avatar>
                <div className="ml-3 bg-stroke bg-opacity-20 border-white/50 border py-1 px-3 rounded-full backdrop-blur-lg">
                    <div className="text-xs text-gray-600 uppercase">
                        {walletAddress && formatAddress(walletAddress)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default WalletProfile