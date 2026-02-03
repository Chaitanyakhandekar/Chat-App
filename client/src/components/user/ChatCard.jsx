import React from 'react'
import { useContext } from 'react'
import { authContext } from '../../context/authContext.jsx'
import { messageApi } from '../../api/message.api.js';
import { useChatStore } from '../../store/useChatStore.js';
import { chatApi } from '../../api/chat.api.js';

const {addMessage,currentChatId} = useChatStore.getState();

function ChatCard({
    user={
        name: "John Doe",
        avatar:"https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png"
    },
    searchMode=false

}) {

    const context = useContext(authContext);
    const {userChats} = useChatStore();

    const createSingleChat = async ()=>{
        console.log("Creating Single Chat with User :: ",user);
        const response = await chatApi.createSingleChat(user._id);
        if(response.success){
            // addMessage(response.data)
            console.log("Single Chat Created :: ",response.data);
        }
    }

    const getConversationMessages = async ()=>{
        console.log("Getting Conversation Messages with User :: ",user);
        context.setCurrentChatUser(user);
        console.log("Conversation Messages :: ",user) 
        const response = await messageApi.getConversation(user._id)
        console.log(" Messages :: ",response.data) 
        response?.data?.data?.map((msg)=>{
            addMessage(response.chatId,msg)
        })
    }

    const isChatExists = ()=>{
        userChats.forEach((chat)=>{
            if(chat.participants[0]?._id.toString() === user._id.toString() || chat.participants[1]?._id.toString() === user._id.toString()){
                return true;
                
            }
        })

        return false;
    }

  return (
    <div
    onClick={()=>{
        if(searchMode && !isChatExists()){
            createSingleChat();
        }else{
            getConversationMessages();
        }
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