import React, { useEffect } from 'react'
import { useContext } from 'react'
import { authContext } from '../../context/authContext.jsx'
import { messageApi } from '../../api/message.api.js';
import { useChatStore } from '../../store/useChatStore.js';
import { chatApi } from '../../api/chat.api.js';
import { userAuthStore } from '../../store/userStore.js';
import { useAssetsStore } from '../../store/useAssetsStore.js';


const { addMessage, currentChatId, setCurrentChatId, setUserMessages, chatUsersInfo , onlineStatus , resetNewMessagesCount } = useChatStore.getState();

function ChatCard({
    user = {
        name: "John Doe",
        avatar: "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png"
    },
    searchMode = false,
    chatId = null,
    typing = false,
    online = false,
    chat = null,
    newMessages=0

}) {

    const context = useContext(authContext);
    const { userChats } = useChatStore();
    const user1 = userAuthStore().user;
    const {scrollToBottomInChat,setScrollToBottomInChat} = useAssetsStore()

    const createSingleChat = async () => {
        // console.log("Creating Single Chat with User :: ",user);
        const response = await chatApi.createSingleChat(user._id);
        if (response.success) {
            // addMessage(response.data)
            // console.log("Single Chat Created :: ",response.data);


        }
    }

    const getConversationMessages = async () => {
        console.log("Getting Conversation Messages with User :: ", user.username);
        context.setCurrentChatUser(user);
        console.log("Conversation Messages :: ", user)
        const response = await messageApi.getConversation(user._id)
        console.log(" Messages :: ", response.data.data)
        setUserMessages(chatId, response.data.data)


    }

    // useEffect(() => {
    //     // console.log("Online : ", online);
    //     // console.log("current User : ", user1._id);

    //     // console.log("Chat Participants : ", onlineStatus[chat.participants[0]._id]);
    // }, [])

    const isChatExists = () => {
        // console.log("Checking if Chat Exists for User :: ",user);
        let isExists = false;

        userChats.forEach((chat) => {
            // console.log("Chat Participants :: ",chat.participants);
            // console.log("Is Chat Exists for User :: ",chat.participants[0]._id === user._id || chat.participants[1]._id === user._id)
            if (chat.participants[0]._id === user._id || chat.participants[1]._id === user._id) {
                isExists = true;
            }

        })


        return isExists;
    }

    return (
        <div
            onClick={() => {

                

                if (isChatExists()) {
                    setCurrentChatId(chatId);
                    getConversationMessages();
                    resetNewMessagesCount(chatId)
                    setScrollToBottomInChat(true)
                } else {
                    createSingleChat();
                }
            }}
            className="user-item w-full p-3 border-b hover:bg-gray-200 cursor-pointer flex items-center gap-10">
            <div className="flex w-10 h-10 mb-2 relative">
                <img
                    className='w-10 h-10 rounded-[50%]'
                    src={user.avtar} alt="" />
                {
                    online &&
                    <div className="text-green-500 bg-green-500 absolute h-3 w-3 rounded-[50%] top-1 left-[-10%]"></div>
                }
            </div>
            <div className="flex flex-col items-start justify-center">
                <h2 className="font-semibold">{user.username}</h2>
                {
                    typing &&
                    <h2 className="text-sm text-green-500">Typing</h2>
                }
            </div>
           {
            newMessages > 0 &&(
                 <div className="w-5 h-5 rounded-[50%] bg-green-500 flex justify-center items-center p-2 text-white text-sm">{newMessages}</div>
            )
           }
        </div>
    )
}

export default ChatCard