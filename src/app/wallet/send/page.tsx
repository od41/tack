"use client"
import React, { useContext, useState } from 'react'
import SendEth from './_components/send_eth'
import { WalletContext } from '@/app/_components/wallets_context'

const SendPage = () => {
  return (
    <>
    <h2 className='text-lg text-primary-black text-center'>Send</h2>
      <SendEth />
    </>
  )
}

export default SendPage