import React,{useEffect} from 'react'
import { useContext } from 'react'
import { authContext } from '../../context/authContext'
import { getTime } from '../../services/getTime'
import {
  SignalMedium,
  MessageCircle,
  CheckIcon,
  CheckCheck

} from 'lucide-react'
import { userAuthStore } from '../../store/userStore'
import { socket } from '../../socket/socket'
import { socketEvents } from '../../constants/socketEvents'

function Message({ msg, key }) {

  const context = useContext(authContext)
  const {user} = userAuthStore()

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
     key={key} className={`ml-10 mt-10 w-fit  max-w-[70%] min-w-20 h-auto   mt-20 ${msg.sender === context.user._id ? "bg-blue-400" : "bg-green-400"} text-black p-3  flex flex-col flex-wrap  rounded-md relative`}>
      <div className="mb-2 w-full flex-wrap border-1">{msg.message}</div>
      <div className="flex absolute bottom-1 right-1 items-center justify-end gap-1 mr-1">
        {msg.createdAt && <span className='text-xs text-gray-700 ml-2 '>{getTime(msg.createdAt)}</span>}
        {
          msg.sender === user._id && (
            <div className="">
          {
            msg.status === "sent" && <CheckIcon className={`w-4 h-4  text-gray-500`} />
          }
          {
            msg.status === "seen" &&
            <CheckCheck className={`w-4 h-4  text-blue-500`} />
            }
        </div>
          )
        }
      </div>
    </div>
  )
}

export default Message