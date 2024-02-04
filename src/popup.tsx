import React from 'react'
import WelcomePage from '@/components/pages/root/page'
import AppLayout from './App'
import '@/styles/globals.css'


const Popup = () => {
  return (
    <AppLayout>
    <div className='p-[800px]'>
      <WelcomePage />
      </div>
      </AppLayout>
  )
}

export default Popup