'use client'

import { cn, configureAssistant, getSubjectColor } from '@/lib/utils'
import { vapi } from '@/lib/vapi.sdk'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import soundwaves from '@/constants/soundwaves.json'
import { addToSessionHistory } from '@/lib/actions/companion.actions'
import SessionFeedbackModal from './SessionFeedbackModal'
import SessionProgressBar from './SessionProgressBar'

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

const CompanionComponent = ({companionId, subject, topic, name, userName, style, voice, duration}: CompanionComponentProps) => {

    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const [messages, setMessages] = useState<SavedMessage[]>([])


    const lottieRef = useRef<LottieRefCurrentProps>(null)

    useEffect(() => {
        if(lottieRef){
            if(isSpeaking){
                lottieRef.current?.play()
            }else {
                lottieRef.current?.stop()
            }
        }

    }, [isSpeaking, lottieRef])
    

   useEffect(() => {
        console.log(duration)
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED)
            addToSessionHistory(companionId)
            setShowModal(true)
        }
        const onMessage = (message: Message) => { 
            if(message.type === "transcript" && message.transcriptType === "final"){
                const newMessage = { role: message.role, content: message.transcript}
                setMessages((prev) =>[newMessage, ...prev])
            }
        }
        const onSpeechStart = () => setIsSpeaking(true)
        const onSpeechEnd = () => setIsSpeaking(false)
        const onError = (error: Error) => console.log("Error", error.message)

        vapi.on('call-start', onCallStart)
        vapi.on('call-end', onCallEnd)
        vapi.on('message', onMessage)
        vapi.on('error', onError)
        vapi.on('speech-start', onSpeechStart)
        vapi.on('speech-end', onSpeechEnd)
   
        return () => {
            vapi.off('call-start', onCallStart)
            vapi.off('call-end', onCallEnd)
            vapi.off('message', onMessage)
            vapi.off('error', onError)
            vapi.off('speech-start', onSpeechStart)
            vapi.off('speech-end', onSpeechEnd)
        }
   }, [])

   const toggleMicrophone = () =>{
    const isMuted = vapi.isMuted()
    vapi.setMuted(!isMuted)
    setIsMuted(!isMuted)
   }

   const handleCall =  async () =>{
        setCallStatus(CallStatus.CONNECTING)

        const assistantOverrides = {
            variableValues :{
                   subject, topic, style
            }, 
            clientMessages: ['transcript'],
            serverMessages: []
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        vapi.start(configureAssistant(voice,style), assistantOverrides)

        //vapie.s

   }
    const handleDisconnect =  async () =>{
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
   }
   
    return (
    <section className='flex flex-col max-h-[70vh]  max-sm:p-5'>
        <SessionFeedbackModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                companionId={companionId}    
                
        />
        <section className='flex gap-2 max-sm:flex-col-reverse max-sm:max-h-140 max-sm:items-start max-h-400 '>
            <div className='flex flex-col w-1/4 max-sm:w-full justify-between gap-2 max-sm:gap-3'>
            <div className='companion-section '>
                <div className='companion-avatar' style={{backgroundColor: getSubjectColor(subject)}}>
                        <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-1001' : 'opacity-0', callStatus === CallStatus.CONNECTING  && 'opacity-100 animate-pulse')} >
                            <Image src={`/icons/${subject}.svg`}  alt={subject} width={80} height={80} className='max-sm:w-fit'/>
                        </div>
                        <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
                            <Lottie  
                                lottieRef={lottieRef}
                                animationData={soundwaves}
                                autoPlay={false}
                                className='companion-lottie'
                            />
                        </div>
                </div>
                 <p className='font-bold text-2xl'>{name}</p>
            </div>
            <div className='flex justify-between'>
                    <button 
                        disabled={callStatus !== CallStatus.ACTIVE}
                        className='btn-mic w-full' 
                        onClick={toggleMicrophone}>
                        <Image src={isMuted ? `/icons/mic-off.svg`  : `/icons/mic-on.svg` } alt={"mic"} width={30} height={30} />
                        <p className='max-sm:hidden text-sm'>
                            {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
                        </p>
                    </button>
                    {/* <button 
                        disabled={callStatus !== CallStatus.ACTIVE}
                        className='btn-mic' 
                        onClick={toggleMicrophone}>
                        <Image src={isMuted ? `/icons/mic-off.svg`  : `/icons/mic-on.svg` } alt={"mic"} width={30} height={30} />
                        <p className='max-sm:hidden text-sm'>
                            Repeat
                        </p>
                    </button> */}
            </div>
                <button 
                        className={cn('rounded-xl py-2 cursor-pointer transition-colors w-full text-white',callStatus === CallStatus.ACTIVE  ? 'bg-red-700' : 'bg-primary', callStatus === CallStatus.CONNECTING && 'animate-pulse')} 
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall }>
                        {callStatus === CallStatus.ACTIVE ? 'End Session' : callStatus === CallStatus.CONNECTING ? 'Connecting' : 'Start Session'}
                </button>
            </div>
            <section className="transcript w-3/4 max-sm:w-full max-sm:min-h-200 pt-0 max-h-[400px]">
                <div className="transcript-message min-h-100 p-5 no-scrollbar overflow-scroll">
                    {messages.map((message, index) => {
                        if(message.role === 'assistant') {
                            return (
                                <p key={index} className="max-sm:text-sm text-xl">
                                    {
                                        name
                                            .split(' ')[0]
                                            .replace('/[.,]/g, ','')
                                    }: {message.content}
                                </p>
                            )
                        } else {
                           return <p key={index} className="text-primary max-sm:text-sm text-xl">
                                {userName}: {message.content}
                            </p>
                        }
                    })}
                </div>

                <div className="transcript-fade" />
            </section>
            {/* <div className='user-section max-sm:hidden'>
                <div className='user-avatar relative min-h-110'>
                    <Image src={userImage} alt={userName} width={130} height={130} className='rounded-lg absolute top-0 left-1/2 -translate-x-1/2 h-full w-auto object-cover' />
                    <p className='font-bold text-2xl absolute bottom-5 bg-white py-2 px-4 rounded-2xl'>{userName}</p>
                </div>
            </div> */}
        </section>
        <SessionProgressBar 
            duration={duration} 
            color={getSubjectColor(subject)} 
            started={callStatus === CallStatus.ACTIVE}
        />
    </section>
)
}

export default CompanionComponent