import React from 'react'

const Container = ({ children }: any) => {
  return (
    <div className='container min-w-[360px] max-w-[552px] bg-glass backdrop-blur-md bg-white bg-opacity-20 rounded-3xl border-white/75 m-3 p-4 border-2 z-50'>
      <header className="py-4 center w-full">
        <div className="flex justify-center w-full">
          Tack
        </div>
      </header>
      <div className="w-full p-4 bg-white rounded-3xl backdrop-blur-lg bg-white bg-opacity-40">
        {children}
      </div>
      </div>
  )
}

export default Container