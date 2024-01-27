import Link from 'next/link'
import React from 'react'

const Container = ({ children }: any) => {
  return (
    <div className='container min-w-[360px] max-w-[452px] max-h-[623px] bg-glass backdrop-blur-md bg-white bg-opacity-20 rounded-3xl border-white/45 m-3 p-4 border z-50'>
      <header className="py-2 center w-full">
        <div className="flex justify-center w-full font-medium text-accent-2 tracking-widest uppercase">
          drops
        </div>
      </header>
      <div className="w-full p-4 bg-white rounded-3xl backdrop-blur-lg bg-white bg-opacity-40">
        {children}
      </div>
      <div className="flex flex-col w-full gap-5 mt-4 items-center mx-auto">
        <div className="text-xs text-muted">
          builder <Link href="https://twitter.com/elder41_" target='blank' className='underline'>elder41_</Link> circa '24
        </div>
      </div>
      </div>
  )
}

export default Container