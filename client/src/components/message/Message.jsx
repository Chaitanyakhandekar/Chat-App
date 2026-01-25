import React from 'react'
import { useContext } from 'react'
import { authContext } from '../../context/authContext'

function Message({ msg, index }) {

    const context = useContext(authContext)
  return (
     <div key={index} className={`ml-10 mt-10 w-fit  max-w-[70%]  h-auto   mt-20 ${msg.from === context.user._id || msg.sender === context.user._id ? "bg-blue-400" : "bg-green-400"} text-black p-3 rounded-md`}>{msg.message}</div>
  )
}

export default Message