import React,{useEffect} from 'react'
import { useContext } from 'react'
import { authContext } from '../../context/authContext'
import { getTime } from '../../services/getTime'
import {
  SignalMedium,
  MessageCircle,
  CheckIcon,
  CheckCheck,
  

} from 'lucide-react'
import { userAuthStore } from '../../store/userStore'
import { socket } from '../../socket/socket'
import { socketEvents } from '../../constants/socketEvents'
import { useChatStore } from '../../store/useChatStore'

function Message({ msg, key }) {

  const context = useContext(authContext)
  const {user} = userAuthStore()
  const {resetNewMessagesCount} = useChatStore()

  const messageRef = React.useRef(null)

  useEffect(()=>{

    if(msg.sender === user._id)return
    if(msg.status === "seen") return

    const observer = new IntersectionObserver(
      (entries)=>{
        entries.forEach((entry)=>{

          if(entry.isIntersecting){     // seen event emit

            console.log("Message " + msg.message +  " is On viewport...")

            socket.emit(socketEvents.MESSAGE_SEEN_SINGLE_CHAT,{     // emiting message seen event for single chat
              messageId:msg._id,
              chatId:msg.chatId
            })

            resetNewMessagesCount(msg.chatId)

            observer.disconnect()
          }


        })
      },
      {
        threshold:0.6     // 60% message visible
      }
    )

    if(messageRef.current){
      observer.observe(messageRef.current)
    }

    return ()=> observer.disconnect()

  },[msg._id])

  return (
    
    <div
     ref={messageRef}
     key={key} className={`ml-10 mt-10 w-fit  max-w-[70%] min-w-20 h-auto   mt-20 ${msg.sender === context.user._id ? "bg-blue-400" : "bg-green-400"} text-black ${msg?.attachments?.length && msg?.message ? " p-3" : "p-"}  flex flex-col flex-wrap  rounded-md relative`}>

      {
        msg?.attachments && 
          <div className="w-full relative">
          <img
          className='rounded-md object-cover'
         src={msg?.attachments[0]?.preview || ""} alt="" />
            
         {
          msg.status==="uploading" &&
          <div className="w-10 h-10 rounded-[50%] animate-spin text-green-500 border-2 border-green-500 bg-gray-600/70 bg-blur-md  font-bold-2xl absolute top-[50%] left-[50%] z-20"></div>
         }
      </div>
      }

      <div className="mb-2 w-full break-words whitespace-pre-wrap px-3 pt-2 pb-3">{msg?.message}</div>
      <div className="flex absolute bottom-1 right-1 items-center justify-end gap-1 mr-1">
        {msg?.createdAt && <span className='text-xs text-white ml-2 z-10'>{getTime(msg?.createdAt)}</span>}
        {
          msg.sender === user._id && (
            <div className="z-10">
          {
            msg.status === "sent"   && <CheckIcon className={`w-4 h-4  text-gray-500 z-20`} />
          }
          {
            msg.status === "seen" &&
            <CheckCheck className={`w-4 h-4  text-blue-300 z-20`} />
            }
        </div>
          )
        }
      </div>

      {
        !msg?.message && 
        <div className="absolute h-[7%] border-1 bottom-0 w-full bg-gray-400/10 backdrop-blur-sm"></div>
      }
    </div>
  )
}

export default Message