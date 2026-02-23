import React, { useEffect } from 'react'
import { useContext } from 'react'
import { authContext } from '../../context/authContext.jsx'
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
    time = null
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
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');

                .chat-card {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 12px;
                    border-radius: 12px;
                    cursor: pointer;
                    margin-bottom: 2px;
                    position: relative;
                    transition: background 0.18s ease;
                    font-family: 'Sora', sans-serif;
                }

                .chat-card:hover {
                    background: rgba(255,255,255,0.05);
                }

                .chat-card:active {
                    background: rgba(99,102,241,0.1);
                }

                .chat-card-avatar-wrap {
                    position: relative;
                    flex-shrink: 0;
                    width: 44px;
                    height: 44px;
                }

                .chat-card-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid rgba(255,255,255,0.07);
                    display: block;
                }

                .chat-card-online-dot {
                    position: absolute;
                    bottom: 1px;
                    right: 1px;
                    width: 10px;
                    height: 10px;
                    background: #22d3a0;
                    border-radius: 50%;
                    border: 2px solid #0e1018;
                    box-shadow: 0 0 6px #22d3a0;
                }

                .chat-card-body {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .chat-card-name {
                    font-size: 13.5px;
                    font-weight: 600;
                    color: #f1f2f7;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    letter-spacing: -0.2px;
                }

                .chat-card-sub {
                    font-size: 11.5px;
                    color: #4a4e6a;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .chat-card-sub.typing {
                    color: #22d3a0;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .typing-dots {
                    display: flex;
                    gap: 2px;
                    align-items: center;
                }

                .typing-dots span {
                    width: 3px;
                    height: 3px;
                    background: #22d3a0;
                    border-radius: 50%;
                    animation: blink-card 1.2s infinite;
                }

                .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes blink-card {
                    0%, 80%, 100% { opacity: 0.2; }
                    40% { opacity: 1; }
                }

                .chat-card-right {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 5px;
                    flex-shrink: 0;
                }

                .chat-card-time {
                    font-size: 10.5px;
                    color: #4a4e6a;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: -0.3px;
                }

                .chat-card-badge {
                    min-width: 18px;
                    height: 18px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 5px;
                    font-size: 10px;
                    font-weight: 700;
                    color: #fff;
                    box-shadow: 0 2px 8px rgba(99,102,241,0.45);
                    font-family: 'Sora', sans-serif;
                }
            `}</style>

            <div
                onClick={() => {
                    if (isChatExists()) {
                        setCurrentChatId(chatId);
                        getConversationMessages();
                        resetNewMessagesCount(chatId);
                        setScrollToBottomInChat(true);
                    } else {
                        createSingleChat();
                    }
                }}
                className="chat-card"
            >
                {/* Avatar */}
                <div className="chat-card-avatar-wrap">
                    <img className="chat-card-avatar" src={user.avtar} alt="" />
                    {online && <div className="chat-card-online-dot" />}
                </div>

                {/* Name + typing/status */}
                <div className="chat-card-body">
                    <span className="chat-card-name">{user.username}</span>
                    {typing ? (
                        <span className="chat-card-sub typing">
                            <span className="typing-dots">
                                <span /><span /><span />
                            </span>
                            typing
                        </span>
                    ) : (
                        <span className="chat-card-sub">
                            {online ? 'Online' : ''}
                        </span>
                    )}
                </div>

                {/* Time + unread badge */}
                {newMessages > 0 && (
                    <div className="chat-card-right">
                        {time && <span className="chat-card-time">{time}</span>}
                        <div className="chat-card-badge">{newMessages}</div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ChatCard