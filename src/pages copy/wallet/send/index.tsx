
import React, { useContext, useState } from 'react'
import SendEth from '../../../components/pages/wallet/send/send_eth'
import { WalletContext } from '@/context/wallet'

const SendPage = () => {
  return (
    <>
    <h2 className='text-lg text-primary-black text-center'>Send</h2>
      <SendEth />
    </>
  )
}

export default SendPage