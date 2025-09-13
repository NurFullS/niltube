'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

const Logo = () => {

    const router = useRouter()

  return (
    <div>
        <button className='text-2xl font-bold p-2 text-blue-400 cursor-pointer' onClick={() => router.push('/')}>NilTube</button>
    </div>
  )
}

export default Logo