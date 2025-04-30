import { cn } from '@/lib/utils'
import { CallControls, CallingState, CallParticipantsList, CallStats, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { LayoutList, User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'
import Loader from './Loader'
import { useRouter } from 'next/navigation'
  

type CallLayoutType = 'gride' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {

    const SearchParams = useSearchParams();

    const isPersonalRoom = !!SearchParams.get('personal')

    const [layout, setlaypout] = useState<CallLayoutType>('speaker-left')

    const [showParicipants, setshowParicipants] = useState(false)

    const { useCallCallingState } = useCallStateHooks();

    const router = useRouter();

    const callingState = useCallCallingState();

    if(callingState !== CallingState.JOINED) return <Loader />

    const CallLayout = () => {
        switch (layout) {
            case 'gride':
                return <PaginatedGridLayout />
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition={"left"}/>
            default:
                return <SpeakerLayout participantsBarPosition={"right"}/>
        }
    }

  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
        <div className='relative flex size-full items-center justify-center'>
            <div className='flex size-full max-w-[1000px] items-center'>
                <CallLayout />
            </div>
            <div className={cn('h-[cal(100vh-86px)] hidden ml-2',{ 'show-block': showParicipants})}>
                <CallParticipantsList onClose={() => setshowParicipants(false)} />
            </div>
        </div>

        <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap'>
            <CallControls onLeave={() => router.push('/')}/>

            <DropdownMenu>

                <div className='flex items-center'>
                <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232D] px-4  py-2 hover:bg-[#4C535B]'>
                    <LayoutList  size={20} className='text-white'/>
                </DropdownMenuTrigger>
                     
                </div>

                <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
                    {['Gride', 'Speaker-Left','Speaker-Right'].map((item, index) => (
                        <div key={index}>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => {
                                setlaypout(item.toLowerCase() as CallLayoutType)
                            }}>
                                {item}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className='border-dark-1'/>
                        </div>
                    ))}
                    
                </DropdownMenuContent>
            </DropdownMenu>

            <CallStatsButton />

            <button onClick={() =>setshowParicipants((prev) => !prev )}>
                <div className='cursor-pointer rounded-2xl bg-[#19232D] px-4  py-2 hover:bg-[#4C535B]'>
                    <User size={20} className='text-white'/>
                </div>
            </button>
            {!isPersonalRoom && <EndCallButton />}
        </div>
    </section>
  )
}

export default MeetingRoom