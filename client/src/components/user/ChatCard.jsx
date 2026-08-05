import React from 'react'
import { useContext } from 'react'
import { authContext } from '../../context/AuthProvider.jsx'
import { messageApi } from '../../api/message.api.js';
import { useChatStore } from '../../store/useChatStore.js';
import { useGroupChatStore } from '../../store/useGroupChatStore.js';
import { chatApi } from '../../api/chat.api.js';
import { useAssetsStore } from '../../store/useAssetsStore.js';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Check } from 'lucide-react';
import { useRequest } from '../../hooks/useRequest.jsx';
import { getTime } from '../../services/getTime.js';
import { groupApi } from '../../api/group.api.js';
import { Avatar, Badge, TypingDots } from '../ui/index.js';

const { setCurrentChatId, setUserMessages, resetNewMessagesCount, setIsGroupChat } = useChatStore.getState();
const { setGroupChat } = useGroupChatStore.getState();

function ChatCard({
    user = {
        name: "John Doe",
        avtar: "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png",
        groupName: ""
    },
    searchMode = false,
    chatId = null,
    typing = false,
    online = false,
    chat = null,
    newMessages = 0,
    time = null,
    setQuery
}) {

    const context = useContext(authContext);
    const navigate = useNavigate()
    const { setCurrentPreviewFile, addChat, resetUserSearch, currentChatId: activeChatId } = useChatStore();
    const { setScrollToBottomInChat } = useAssetsStore()

    const isActive = activeChatId === chatId && !searchMode

    const {
        sendFriendRequest,
        sendingRequest,
        requestSent
    } = useRequest()

    const handleSendFriendRequest = async (e) => {
        e.stopPropagation();
        if (sendingRequest || requestSent) return;
        await sendFriendRequest(user._id)
    };

    const createSingleChat = async () => {
        const response = await chatApi.createSingleChat(user._id);
        if (response.success) {
            addChat(response.data)
            setCurrentChatId(response.data._id)
            setCurrentPreviewFile(null)
            navigate(`/chat/${response.data._id}`)
            getConversationMessages();
            resetNewMessagesCount(response.data._id);
            setScrollToBottomInChat(true);
            setQuery("")
            resetUserSearch();
        }
    }

    const getConversationMessages = async (groupId = null) => {
        console.log("Getting Conversation Messages with User :: ", user.username);
        context.setCurrentChatUser(user);
        let response;
        if (groupId) {
            console.log("Getting Group Conversation Messages for Group ID :: ", groupId)
            response = await groupApi.getConversation(groupId)
        }
        else {
            response = await messageApi.getConversation(user._id)
        }
        console.log(" Messages :: ", response?.data?.data)
        const payload = response?.data?.data
        const msgs = Array.isArray(payload) ? payload : (payload?.messages || [])
        setUserMessages(chatId, msgs)
        if (payload && !Array.isArray(payload)) {
            const { setPaginationMeta } = useChatStore.getState()
            setPaginationMeta(chatId, {
                hasMore: !!payload.hasMore,
                nextCursor: payload.nextCursor || null,
                isLoadingMore: false
            })
        }
    }

    const isThisGroupChat = () => {
        return chat?.isGroupChat || false;
    }

    const isSingleChat = () => {
        return !chat?.isGroupChat || false;
    }

    const isChatExists = async () => {
        const response = await chatApi.isChatExists(chat?._id)
        return response.success;
    }

    const handleChatCardClick = () => {
        if (isChatExists()) {
            if (isThisGroupChat()) {
                setCurrentChatId(chatId);
                setIsGroupChat(chat.isGroupChat);
                setGroupChat(chat);
                setCurrentPreviewFile(null)
                navigate(`/chat/${chat?._id}`)
                getConversationMessages(chat?._id);
                resetNewMessagesCount(chatId);
                setScrollToBottomInChat(true);
            }
            else if (isSingleChat()) {
                setCurrentChatId(chatId);
                setIsGroupChat(chat?.isGroupChat);
                if (chat?.isGroupChat) {
                    setGroupChat(chat);
                }
                setCurrentPreviewFile(null)
                navigate(`/chat/${chat?._id}`)
                getConversationMessages();
                resetNewMessagesCount(chatId);
                setScrollToBottomInChat(true);
            }
        }
        else {
            createSingleChat();
        }
    }

    const avatarSrc = !chat?.isGroupChat && user.avtar ? user.avtar
        : chat?.isGroupChat ? chat?.groupPicture
            : `https://api.dicebear.com/7.x/shapes/svg?seed=${user._id}&scale=90`

    return (
        <div
            onClick={handleChatCardClick}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer mb-0.5 transition-colors duration-150 border ${
                isActive
                    ? 'border-transparent md:border-accent/25 md:bg-accent/15'
                    : 'border-transparent hover:bg-surface-hover'
            }`}
        >
            {/* Avatar */}
            <Avatar
                src={avatarSrc}
                name={!chat?.isGroupChat && user?.username || chat?.groupName || ''}
                size="lg"
                online={online && !chat?.isGroupChat}
            />

            {/* Name + status */}
            <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                <span className={`text-sm font-medium truncate ${isActive ? 'md:text-white md:font-semibold' : 'text-text-primary'}`}>
                    {!chat?.isGroupChat && user?.username || chat?.groupName || "Unknown User"}
                </span>
                {typing ? (
                    <span className="flex items-center gap-1.5 text-xs text-success font-medium truncate">
                        <TypingDots />
                        typing
                    </span>
                ) : (
                    <span className="text-xs text-text-muted truncate">
                        {newMessages > 0 ? (
                            <span className="text-accent-light font-medium">{newMessages} new messages</span>
                        ) : !chat?.isGroupChat && online ? (
                            <span className="text-success/90 font-medium">Online</span>
                        ) : (
                            time ? getTime(time) : ""
                        )}
                    </span>
                )}
            </div>

            {/* Unread badge or Search Action */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {newMessages > 0 && !searchMode && (
                    <Badge variant="primary">{newMessages}</Badge>
                )}

                {searchMode && user?.isFriend === false && (
                    <button
                        onClick={handleSendFriendRequest}
                        disabled={sendingRequest || requestSent}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium transition-colors duration-150 ${requestSent
                            ? 'bg-success/15 text-success border border-success/30'
                            : sendingRequest
                                ? 'bg-surface-600 text-text-muted'
                                : 'bg-accent/15 text-accent-light hover:bg-accent/25 border border-accent/30'
                            }`}
                        title={requestSent ? 'Friend request sent' : 'Send friend request'}
                    >
                        {requestSent || user?.requests?.[0]?.status === "pending" ? (
                            <>
                                <Check size={12} />
                                <span>Sent</span>
                            </>
                        ) : sendingRequest ? (
                            <span className="flex items-center gap-1">
                                <TypingDots className="text-text-muted" />
                            </span>
                        ) : (
                            <>
                                <UserPlus size={12} />
                                <span>Add</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

export default ChatCard
