import Image from 'next/image'
import React from 'react'

const Agent = () => {
  return (
    <div className ="flex sm:flex-row flex-col gap-10 items-center justify-between w-full">
      <div className="flex-center flex-col gap-2 p-7 h-[400px] blue-gradient rounded-lg border-2 border-primary-200/50 flex-1 sm:basis-1/2 w-full">
        <div className=" z-10 flex items-center justify-center  rounded-full size-[120px] relative">
          <Image src="/logo.png" alt='vapi' width={65} height={54}className='object-cover'/>

        </div>
      </div>

    </div>
  )
}

export default Agent