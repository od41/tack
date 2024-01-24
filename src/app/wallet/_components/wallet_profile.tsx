"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatAddress } from '@/lib/utils'
import React, { useState } from 'react'

const WalletProfile = () => {
  const [walletAddress, setWalletAddress] = useState('0xFCB6ee26891fcd71ca0884B2b8a989Fbdc4B2628')

    return (
        <>
            <div className="flex items-center mb-4">

                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>Wallet</AvatarFallback>
                </Avatar>
                <div className="ml-3 bg-stroke bg-opacity-20 border-white/50 border py-1 px-3 rounded-full backdrop-blur-lg">
                    <div className="text-xs text-gray-600 uppercase">
                        {formatAddress(walletAddress)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default WalletProfile