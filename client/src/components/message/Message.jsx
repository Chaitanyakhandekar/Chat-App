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

function Message({ msg, key }) {

  const context = useContext(authContext)
  const {user} = userAuthStore()

  const messageRef = React.useRef(null)

  useEffect(()=>{

    if(msg.sender === user._id)return
    if(msg.seen) return

  },[msg._id])

  return (
    <div key={key} className={`ml-10 mt-10 w-fit  max-w-[70%] min-w-20 h-auto   mt-20 ${msg.sender === context.user._id ? "bg-blue-400" : "bg-green-400"} text-black p-3  flex flex-col  rounded-md relative`}>
      <div className="mb-2">{msg.message}</div>
      <div className="flex absolute bottom-1 right-1 items-center justify-end gap-1 mr-1">
        {msg.createdAt && <span className='text-xs text-gray-700 ml-2 '>{getTime(msg.createdAt)}</span>}
        {
          msg.sender === user._id && (
            <div className="">
          <CheckCheck className={`w-4 h-4  text-blue-500`} />
        </div>
          )
        }
      </div>
    </div>
  )
}

export default Message