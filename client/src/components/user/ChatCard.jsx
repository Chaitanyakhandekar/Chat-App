import React, { useEffect } from 'react'
import { useContext } from 'react'
import { authContext } from '../../context/AuthProvider.jsx'
import { messageApi } from '../../api/message.api.js';
import { useChatStore } from '../../store/useChatStore.js';
import { chatApi } from '../../api/chat.api.js';
import { userAuthStore } from '../../store/userStore.js';
import { useAssetsStore } from '../../store/useAssetsStore.js';

const { addMessage, currentChatId, setCurrentChatId, setUserMessages, chatUsersInfo, onlineStatus, resetNewMessagesCount } = useChatStore.getState();

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
    newMessages = 0,
    time = null,
    setShowSidebar
}) {

    const context = useContext(authContext);
    const { userChats } = useChatStore();
    const user1 = userAuthStore().user;
    const { scrollToBottomInChat, setScrollToBottomInChat } = useAssetsStore()

    const createSingleChat = async () => {
        const response = await chatApi.createSingleChat(user._id);
        if (response.success) {}
    }

    const getConversationMessages = async () => {
        console.log("Getting Conversation Messages with User :: ", user.username);
        context.setCurrentChatUser(user);
        const response = await messageApi.getConversation(user._id)
        console.log(" Messages :: ", response.data.data)
        setUserMessages(chatId, response.data.data)
    }

    const isChatExists = () => {
        let isExists = false;
        userChats.forEach((chat) => {
            if (chat.participants[0]._id === user._id || chat.participants[1]._id === user._id) {
                isExists = true;
            }
        })
        return isExists;
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap');

                .typing-dot-card { animation: blink-card 1.2s infinite; }
                .typing-dot-card:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot-card:nth-child(3) { animation-delay: 0.4s; }
                @keyframes blink-card {
                    0%, 80%, 100% { opacity: 0.2; }
                    40% { opacity: 1; }
                }
                .chat-card-time { font-family: 'JetBrains Mono', monospace; }
            `}</style>

            <div
                onClick={() => {
                    if (isChatExists()) {
                        setCurrentChatId(chatId);
                        setShowSidebar(false)
                        getConversationMessages();
                        resetNewMessagesCount(chatId);
                        setScrollToBottomInChat(true);
                    } else {
                        createSingleChat();
                    }
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer mb-0.5 transition-all duration-[180ms] hover:bg-white/[0.05] active:bg-[rgba(99,102,241,0.1)]"
                style={{ fontFamily: "'Sora', sans-serif" }}
            >
                {/* Avatar */}
                <div className="relative flex-shrink-0 w-11 h-11">
                    <img
                        src={user.avtar}
                        alt=""
                        className="w-11 h-11 rounded-full object-cover border-2 border-white/[0.07] block"
                    />
                    {online && (
                        <div
                            className="absolute bottom-[1px] right-[1px] w-2.5 h-2.5 rounded-full bg-[#22d3a0] border-2 border-[#0e1018]"
                            style={{ boxShadow: '0 0 6px #22d3a0' }}
                        />
                    )}
                </div>

                {/* Name + status */}
                <div className="flex flex-col flex-1 min-w-0 gap-[2px]">
                    <span className="text-[13.5px] font-semibold text-[#f1f2f7] tracking-[-0.2px] truncate">
                        {user.username}
                    </span>
                    {typing ? (
                        <span className="flex items-center gap-1 text-[11.5px] text-[#22d3a0] truncate">
                            <span className="flex gap-[2px] items-center">
                                <span className="typing-dot-card w-[3px] h-[3px] rounded-full bg-[#22d3a0] inline-block" />
                                <span className="typing-dot-card w-[3px] h-[3px] rounded-full bg-[#22d3a0] inline-block" />
                                <span className="typing-dot-card w-[3px] h-[3px] rounded-full bg-[#22d3a0] inline-block" />
                            </span>
                            typing
                        </span>
                    ) : (
                        <span className="text-[11.5px] text-[#4a4e6a] truncate">
                            {online ? 'Online' : ''}
                        </span>
                    )}
                </div>

                {/* Time + unread badge */}
                {newMessages > 0 && (
                    <div className="flex flex-col items-end gap-[5px] flex-shrink-0">
                        {time && (
                            <span className="chat-card-time text-[10.5px] text-[#4a4e6a] tracking-[-0.3px]">
                                {time}
                            </span>
                        )}
                        <div
                            className="flex items-center justify-center min-w-[18px] h-[18px] px-[5px] rounded-[20px] text-[10px] font-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.45)' }}
                        >
                            {newMessages}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ChatCard