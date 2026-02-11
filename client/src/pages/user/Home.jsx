import React, { useRef } from 'react'
import ChatCard from '../../components/user/ChatCard.jsx'
import { useEffect } from 'react'
import { userApi } from '../../api/user.api.js'
import { useContext } from 'react'
import { authContext } from '../../context/authContext.jsx'
import { socket } from '../../socket/socket.js'
import {
    MessageCircle,
    Send

} from 'lucide-react'
import Message from '../../components/message/Message.jsx'
import { messageApi } from '../../api/message.api.js'
import { useChatStore } from '../../store/useChatStore.js'
import { chatApi } from '../../api/chat.api.js'
import { userAuthStore } from '../../store/userStore.js'
import { socketEvents } from '../../constants/socketEvents.js'

function Home() {

    // const [users,setUsers] = React.useState([])
    const context = useContext(authContext);
    const [message, setMessage] = React.useState("")
    const [query, setQuery] = React.useState("")
    // const [messages,setMessages] = React.useState([])

    const { user } = userAuthStore()

    const users = useChatStore(state => state.userChats)
    const setUsers = useChatStore(state => state.setUserChats)

    const messages = useChatStore(state => state.userMessages)
    const addMessage = useChatStore(state => state.addMessage)
    const currentChatId = useChatStore(state => state.currentChatId)

    const { userSearch, setUserSearch, setChatUsersInfo, chatUsersInfo, emitedTyping, toogleEmitedTyping , onlineStatus } = useChatStore()


    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);


    const getAllUsers = async () => {
        const response = await chatApi.getUserChats();
        if (response.success) {
            setUsers(response.data);
            setChatUsersInfo(response.data)
            console.log("All users fetched:", response.data);
        }
    }

    const getConversationMessages = async (otherUserId) => {
        const messages = await messageApi.getConversation(otherUserId)
    }


    const handleSend = () => {
        console.log("Send button clicked");
        if (message.trim() === "") {
            return;
        }
        if (!socket) return
        socket.emit(socketEvents.NEW_MESSAGE, {
            message: message,
            receiver: context.currentChatUser._id,
            chatId: currentChatId || null
        }, (ack) => {
            console.log("Ack from server:", ack);
        })
        addMessage(currentChatId, {
            sender: user._id,
            receiver: context.currentChatUser._id,
            message: message,
            chatId: currentChatId
        })

        setMessage("")
    }

    useEffect(() => {

        getAllUsers();
        console.log("Current logged in user:", context.user);



    }, [])

    useEffect(() => {

        console.log("User Messages Updated : ", messages);

    }, [messages])

    useEffect(() => {
        console.log("Current logged in user:", context.currentChatUser);
        // getConversationMessages(context.currentChatUser._id)
    }, [context.currentChatUser])


    const searchUsers = async (query) => {
        setQuery(query);
        try {
            const response = await userApi.searchUsers(query);
            if (response.success) {
                setUserSearch(response.data);
                console.log("Search Users Response :", response.data);
            }
        } catch (error) {
            console.log("Error while searching users :", error);
        }
    }

    const handleTyping = (e) => {
        const value = e.target.value;
        setMessage(value);

        if (!socket || !context.currentChatUser || !currentChatId) return;

        // 🔹 Emit "typing: true" ONLY ONCE per typing burst
        if (!isTypingRef.current) {
            socket.emit(socketEvents.TYPING, {
                chatId: currentChatId,
                isTyping: true,
            });
            isTypingRef.current = true;
        }

        // 🔹 Clear previous debounce timer
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // 🔹 Set new debounce timer
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit(socketEvents.TYPING, {
                chatId: currentChatId,
                isTyping: false,
            });
            isTypingRef.current = false;
        }, 2000);
    };


    return (
        <div className="w-screen border-1 min-h-screen h-screen flex">

            <div className="chat-users w-1/4 h-full border flex flex-col  items-center bg-gray-100">
                <input type="text" placeholder="Search users..." className='w-[90%] mt-3 p-3 border border-gray-300 rounded-md outline-none text-gray-500 font-semibold' value={query} onChange={(e) => searchUsers(e.target.value)} />

                <div className="users w-full mt-4">
                    {
                        (!query || (query && query.trim() === "")) && users?.map((chat) => (
                            <ChatCard
                                key={chat._id}
                                user={chat.participants[0]._id === user._id ? chat.participants[1] : chat.participants[0]}
                                searchMode={false}
                                chatId={chat._id}
                                typing={chatUsersInfo[chat._id]?.typing || false}
                                online={onlineStatus[chat.participants[0]._id === user._id ? chat.participants[1]._id : chat.participants[0]._id] || false}
                                chat={chat}
                            />
                        ))
                    }
                    {
                        query && userSearch?.map((chat) => (
                            <ChatCard
                                key={chat._id}
                                user={chat} 
                                searchMode={true} />
                        ))
                    }

                </div>
            </div>

            <div className="chat-window w-3/4 h-full border-1 border-blue-500 bg-white relative">
                {context.currentChatUser ? (
                    <div className="w-full h-full flex flex-col items-center justify-center border-1" >
                        <nav className="w-full h-16 border-b flex items-center justify-start px-4 absolute top-0 bg-white z-10 gap-10 ">
                            <div className="w-10 h-10 rounded-full ml-10 relative">
                                <img src={context.currentChatUser.avtar} alt="" className='w-full h-full rounded-[50%]' />
                                <div className="text-green-400 bg-green-400 absolute h-3 w-3 rounded-[50%] top-1 left-[-10%]"></div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <h2 className="font-bold text-xl ml-4">{context.currentChatUser.username}</h2>
                                {chatUsersInfo[currentChatId]?.typing &&
                                    <h2 className='text-sm text-green-500'>Typing...</h2>
                                }

                            </div>
                        </nav>

                        <div className="h-[80%] border-1 border-blue-400 w-full relative overflow-y-scroll">

                            {messages[currentChatId]?.map((msg) => {
                                return (
                                    ((context.currentChatUser._id === msg.sender || context.currentChatUser._id === msg.receiver) && (msg.sender === context.user._id || msg.receiver === context.user._id)) && (
                                        <Message
                                            key={msg._id}
                                            msg={msg} />
                                    )

                                )
                            })}

                        </div>

                        <footer className="w-full h-20 border-t absolute bottom-0 bg-white z-10 flex items-center">
                            <div className="w-5/6 h-20 border-t flex items-center px-4 absolute bottom-0 bg-white z-10">
                                <input type="text" value={message} onChange={(e) => handleTyping(e)} placeholder="Type a message..." className='w-full h-14 border border-gray-300 rounded-md pl-4 outline-none ' />
                            </div>
                            <div
                                onClick={handleSend}
                                className="absolute right-20 bg-blue-500 cursor-pointer flex items-center justify-center w-12 h-12 border-1 rounded-md">
                                <Send className='w-9 h-9 text-white' />
                            </div>

                        </footer>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold">Select a user to start chatting</h1>
                        <p className="text-gray-500 mt-2">Choose a user from the list on the left to begin messaging.</p>
                    </div>
                )
                }
            </div>

        </div>
    )
}

export default Home