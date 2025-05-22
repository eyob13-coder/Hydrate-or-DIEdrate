import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
}

interface AgentProps {
  userName: string;
  userId: string;
  type: string;
}

const Agent: React.FC<AgentProps> = ({ userName, userId, type }) => {
  const callStatus = CallStatus.FINISHED;
  const isSpeaking = true;
  const messages = [
    'What is your Name',
    'My name is John Doe, nice to meet you!'
  ];

  const lastMessage = messages[messages.length - 1]
  return (
    <>
    <div className ="flex sm:flex-row flex-col gap-10 items-center justify-between w-full">
      <div className="flex-center flex-col gap-2 p-7 h-[400px] blue-gradient rounded-lg border-2 border-primary-200/50 flex-1 sm:basis-1/2 w-full">
        <div className=" z-10 flex items-center justify-center  rounded-full size-[120px] relative">
          <Image src="/logo.png" alt='vapi' width={65} height={54} className='object-cover'/>
          { isSpeaking && <span className=' absolute inline-flex size-5/6 animate-ping rounded-full bg-primary-200 opacity-75'/>}
        </div>
        <h3> AI Assistant</h3>
      </div>
      <div className='border-gradient p-0.5 rounded-2xl w-fit'>
        <div className='flex flex-col gap-2 justify-center items-center p-7 dark-gradient rounded-2xl min-h-full'>
          <Image src="/user-avatar.png" alt='user avatar' width={540} height={540} className='rounded-full object-cover size-[120px]'/>
          <h3>{userName}</h3>

        </div>

      </div>
    </div>

    {messages.length > 0 && (
      <div className='border-gradient p-0.5 rounded-2xl w-full'>
        <div className='dark-gradient rounded-2xl  min-h-12 px-5 py-3 flex items-center justify-center'>
          <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
            {lastMessage}

          </p>

        </div>

      </div>
    )}


    <div className="w-full flex justify-center">
      {callStatus !== 'ACIVE' ? (
        <Button className='relative inline-block px-7 py-3 font-bold text-sm leading-5 text-white transition-colors duration-150 bg-success-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-success-200 hover:bg-success-200 min-w-28 cursor-pointer items-center justify-center overflow-visible'>
          <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus!== 'CONNECTING' & 'hidden')}
            />

            <span>
              {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Call' : '...'}
            </span>
          
        </Button>
      ): (
        <button className=' inline-block px-7 py-3 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-destructive-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-destructive-200 hover:bg-destructive-200 min-w-28'>

          End

        </button>
      )}
    </div>
    </>
  )
}

export default Agent