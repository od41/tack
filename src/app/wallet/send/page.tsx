"use client"
import React, { useState } from 'react'
import SendEth from './_components/send_eth'

const SendPage = () => {
  const [walletAddress, setWalletAddress] = useState('0xFCB6ee26891fcd71ca0884B2b8a989Fbdc4B2628')
  return (
    <>
    <h2 className='text-lg text-primary-black'>Send</h2>
      <SendEth walletAddress={walletAddress} />
    </>
  )
}

export default SendPage