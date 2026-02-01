import React from 'react'
import { useContext } from 'react'
import { authContext } from '../../context/authContext.jsx'
import { messageApi } from '../../api/message.api.js';
import { useChatStore } from '../../store/useChatStore.js';

const {addMessage,currentChatId} = useChatStore.getState();

function ChatCard({
    user={
        name: "John Doe",
        avatar:"https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png"
    },
    

}) {

    const context = useContext(authContext);

  return (
    <div
    onClick={async()=>{
        context.setCurrentChatUser(user);
        console.log("Conversation Messages :: ",user) 
        const response = await messageApi.getConversation(user._id)
        console.log(" Messages :: ",response.data) 
        response?.data?.data?.map((msg)=>{
            addMessage(response.chatId,msg)
        })
    }}
    className="user-item w-full p-3 border-b hover:bg-gray-200 cursor-pointer flex items-center gap-10">
                <div className="flex w-10 h-10 mb-2">
                    <img
                    className='w-10 h-10 rounded-[50%]'
                    src={user.avtar} alt="" />
                </div>
                <h2 className="font-semibold">{user.username}</h2>
            </div>
  )
}

export default ChatCard