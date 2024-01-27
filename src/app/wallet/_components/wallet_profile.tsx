"use client"
import { WalletContext } from '@/app/_components/wallets_context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatAddress } from '@/lib/utils'
import { PowerIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { generateFromString } from 'generate-avatar'
import CopyToClipboardButton from '@/components/ui/copy-to-clipboard'

const WalletProfile = () => {
  const {walletAddress, logout} = useContext(WalletContext)
  const router = useRouter()
  const avatar = generateFromString(walletAddress ? walletAddress : 'default-image-created-tack-2023')

  function handleLogout() {
    router.push('/')
    logout()
  }

    return (
        <div className='flex justify-between'>
            <div className="flex items-center mb-4">

                <Avatar>
                    <AvatarImage src={avatar ? `data:image/svg+xml;utf8,${avatar}` : ''} />
                    <AvatarFallback>Wallet</AvatarFallback>
                </Avatar>
                <div className="ml-3 bg-stroke bg-opacity-20 border-white/50 border py-1 px-3 rounded-full backdrop-blur-lg">
                    <div className="text-xs text-gray-600 uppercase">
                        {walletAddress && formatAddress(walletAddress)}
                        <CopyToClipboardButton textToCopy={walletAddress!} />
                    </div>
                </div>
            </div>

            <Button onClick={handleLogout} variant="ghost" size="icon" className='hover:bg-[#E0DAD4] hover:text-input p-3'><PowerIcon className='w-10 h-10'/></Button>
        </div>
    )
}

export default WalletProfile