import React from 'react'
import { useContext } from 'react'
import { authContext } from '../../context/authContext'
import { getTime } from '../../services/getTime'

function Message({ msg, key }) {

    const context = useContext(authContext)
  return (
     <div key={key} className={`ml-10 mt-10 w-fit  max-w-[70%]  h-auto   mt-20 ${msg.sender === context.user._id ? "bg-blue-400" : "bg-green-400"} text-black p-3 rounded-md`}>{msg.message}
     {msg.createdAt && <span className='text-xs text-gray-700 ml-2'>{getTime(msg.createdAt)}</span>}
     </div>
  )
}

export default Message