"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import vapi from '@/lib/vapi.sdk'
import { useRouter } from "next/navigation";

interface Message {
  type: string;
  transcriptType?: string;
  role: 'user' | 'system' | 'assistant';
  transcript: string;
}

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface AgentProps {
  userName: string;
  userId: string;
  type: string;
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

const Agent = ({ userName, userId, type }: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() =>{
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: Message) => {
      if(message.type === 'transcript' && message.transcriptType === 'final'){
        const newMessage = { role: message.role, content: message.transcript}
        setMessages ((prev) => [...prev, newMessage]);
      }
    }
  

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => 
      console.error('Error:', error);
      setCallStatus(CallStatus.FINISHED);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    }
    

    
  }, [])

  useEffect(() =>{
    if(callStatus === CallStatus.FINISHED) router.push('')
  }, [messages, callStatus, type, userId]);



  const handleCall = async() => {
    setCallStatus (CallStatus.CONNECTING);
    await vapi.start({
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      model: {
        provider: "vapi",
        model: "workflow",
        workflowId: "bdf3911c-88e5-470e-b1c6-a4aaa6b8afd1"
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      variableValues: {
        userName,
      }
    })
    }

const handleDisconnect = async () =>{
  setCallStatus(CallStatus.FINISHED)
   vapi.stop();
}

const latestMessage = messages[messages.length -1]?.content;
const isCallInactiveorFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;
      
   

  

  return (
    <>
      <div className="flex sm:flex-row flex-col gap-10 items-center justify-between w-full">
        <div className="flex-center flex-col gap-2 p-7 h-[400px] blue-gradient-gray rounded-lg border-2 border-primary-200/50 flex-1 sm:basis-1/2 w-full">
          <div className="z-10 flex items-center justify-center rounded-full size-[120px] relative">
            <Image src="/logo.png" alt="vapi" width={65} height={54} className="object-cover" />
            {isSpeaking && (
              <span className="absolute inline-flex size-5/6 animate-ping rounded-full bg-primary-200 opacity-75" />
            )}
          </div>
          <h3 className = "font-bold items-center justify-center" >AI Assistant</h3>
        </div>

        <div className="border-gradient p-0.5 rounded-2xl w-fit">
          <div className="flex flex-col gap-2 justify-center items-center p-7 blue-gradient-gray rounded-2xl min-h-full">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="border-gradient p-0.5 rounded-2xl w-full mt-4">
          <div className="dark-gradient rounded-2xl min-h-12 px-5 py-3 flex items-center justify-center">
            <p className="animate-fadeIn text-white">{latestMessage}</p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center mt-6">
        {callStatus !== CallStatus.ACTIVE ? (
          <button onClick={handleCall} className="relative inline-block px-7 py-3 font-bold text-sm leading-5 text-white bg-green-500 rounded-full min-w-28">
            <span className={cn("absolute animate-ping rounded-full opacity-75", callStatus !== CallStatus.CONNECTING && "hidden")} />
            <span>{isCallInactiveorFinished ? 'Call' : '...'}</span>
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className=" inline-block px-7 py-3 text-sm font-bold text-white bg-red-500 rounded-full min-w-28"
          >
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
