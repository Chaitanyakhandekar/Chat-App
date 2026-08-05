import React, { useRef, useState, useCallback } from 'react'
import { useEffect } from 'react'
import { userApi } from '../../api/user.api.js'
import { useContext } from 'react'
import { authContext } from '../../context/AuthProvider.jsx'
import { socket } from '../../socket/socket.js'
import {
    MessageCircle,
    Send,
    MoveDown,
    ArrowDownCircleIcon,
    Loader2
} from 'lucide-react'
import Message from '../../components/message/Message.jsx'
import { messageApi } from '../../api/message.api.js'
import { useChatStore } from '../../store/useChatStore.js'
import { chatApi } from '../../api/chat.api.js'
import { userAuthStore } from '../../store/userStore.js'
import { socketEvents } from '../../constants/socketEvents.js'
import { useAssetsStore } from '../../store/useAssetsStore.js'
import FileUpload from '../../components/message/FileUpload.jsx'
import MediaPreview from '../../components/message/MediaPreview.jsx'
import SingleFilePreview from '../../components/message/SingleFilePreview.jsx'
import Sidebar from './Sidebar.jsx'
import { useNotification } from '../../hooks/useNotification.jsx'
import { Avatar, Button, TypingDots } from '../../components/ui/index.js'

function Home() {

    const context = useContext(authContext);
    const [message, setMessage] = React.useState("")
    const [query, setQuery] = React.useState("")

    const [activePanel, setActivePanel] = useState("chats")

    const { user } = userAuthStore()
    const { fetchNotifications } = useNotification()

    const users = useChatStore(state => state.userChats)
    const setUsers = useChatStore(state => state.setUserChats)

    const messages = useChatStore(state => state.userMessages)
    const addMessage = useChatStore(state => state.addMessage)
    const currentChatId = useChatStore(state => state.currentChatId)

    const {
        setUserSearch,
        setChatUsersInfo,
        chatUsersInfo,
        onlineStatus,
        incrementNewMessagesCountByN,
        mediaFiles,
        removeMessage,
        resetMediaFiles,
        currentPreviewFile,
        isGroupChat,
        paginationMeta,
        setPaginationMeta,
        setLoadingMore,
        prependMessages
    } = useChatStore()

    const {
        scrollToBottomInChat,
        setScrollToBottomInChat
    } = useAssetsStore()

    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);
    const messageEndRef = useRef(null);
    const chatContainerRef = useRef(null)
    const topSentinelRef = useRef(null)
    const [isAtBottom, setIsAtBottom] = React.useState(true);
    const isMedia = mediaFiles[currentChatId]?.length > 0
    const [, setGroupsOnly] = useState(false)

    const loadUnreadMessages = (chats) => {
        chats.forEach((chat) => {
            incrementNewMessagesCountByN(chat._id, chat.unreadMessagesCount)
        })
    }

    const getMyNotifications = async () => {
        await fetchNotifications()
    }

    const getAllUsers = async () => {
        const response = await chatApi.getUserChats();
        if (response.success) {
            setUsers(response.data);
            loadUnreadMessages(response.data)
            setChatUsersInfo(response.data)
        }
    }

    const getOnlineUsers = async () => {
        const response = await userApi.getOnlineUsers();
        if (response.success) {
            const { setOnlineStatus } = useChatStore.getState();
            for (let user of response.data) {
                setOnlineStatus(user, true)
            }
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()

        if (message.trim() === "" && !mediaFiles[currentChatId]?.length) {
            return;
        }

        const tempId = `temp-${Date.now()}`

        addMessage(currentChatId, {
            _id: tempId,
            chatId: currentChatId,
            message: message.trim() !== "" ? message : "",
            sender: user._id,
            attachments: mediaFiles[currentChatId] || [],
            status: "uploading",
            createdAt: new Date().toISOString()
        })

        setScrollToBottomInChat(true);

        const formData = new FormData()
        let uploadInfo;

        if (mediaFiles[currentChatId]?.length > 0) {
            mediaFiles[currentChatId].length > 0 && mediaFiles[currentChatId].forEach(image => {
                formData.append("images", image.file)
            })

            resetMediaFiles(currentChatId)

            uploadInfo = await messageApi.uploadImages(formData)

            if (!uploadInfo.success) {
                removeMessage(currentChatId, tempId)
                alert("Message Failed Please Try Again.")
            }
        }

        if (!socket) return

        socket.emit(socketEvents.NEW_MESSAGE, {
            message: message || "",
            attachments: uploadInfo?.data || [],
            receiver: context.currentChatUser._id,
            chatId: currentChatId || null,
            tempId: tempId
        })

        setMessage("")
    }

    const scrollToBottom = () => {
        const container = chatContainerRef.current;
        if (!container) return;
        container.scrollTop = container.scrollHeight;
    };

    const loadOlderMessages = useCallback(async () => {
        if (!currentChatId) return
        const meta = paginationMeta[currentChatId]
        if (!meta?.hasMore || meta?.isLoadingMore) return

        setLoadingMore(currentChatId, true)

        const container = chatContainerRef.current
        const prevScrollHeight = container?.scrollHeight || 0

        try {
            const chatState = useChatStore.getState()
            const chat = chatState.userChats.find(c => c._id === currentChatId)
            let response

            if (isGroupChat) {
                const { groupApi } = await import('../../api/group.api.js')
                response = await groupApi.getConversation(currentChatId, meta.nextCursor)
            } else {
                const otherParticipant = chat?.participants?.find(p => p._id !== user._id) || context.currentChatUser
                if (otherParticipant?._id) {
                    response = await messageApi.getConversation(otherParticipant._id, meta.nextCursor)
                }
            }

            if (response?.data?.data) {
                const { messages: olderMsgs, hasMore, nextCursor } = response.data.data
                if (olderMsgs?.length > 0) {
                    prependMessages(currentChatId, olderMsgs)
                    requestAnimationFrame(() => {
                        if (container) {
                            const newScrollHeight = container.scrollHeight
                            container.scrollTop = newScrollHeight - prevScrollHeight
                        }
                    })
                }
                setPaginationMeta(currentChatId, { hasMore: !!hasMore, nextCursor: nextCursor || null, isLoadingMore: false })
            } else {
                setLoadingMore(currentChatId, false)
            }
        } catch (error) {
            console.error("Error loading older messages:", error)
            setLoadingMore(currentChatId, false)
        }
    }, [currentChatId, paginationMeta, isGroupChat])

    useEffect(() => {
        if (user) {
            socket.emit(socketEvents.GET_ONLINE_STATUS);
        }
        getAllUsers();
        getMyNotifications();
        getOnlineUsers();

        const container = chatContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const atBottom =
                container.scrollTop + container.clientHeight >=
                container.scrollHeight - 10;
            setIsAtBottom(atBottom);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [])

    useEffect(() => {
        const sentinel = topSentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadOlderMessages()
                }
            },
            { root: chatContainerRef.current, threshold: 0.1 }
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [loadOlderMessages, currentChatId])

    useEffect(() => {
        if (isAtBottom) {
            requestAnimationFrame(() => {
                scrollToBottom();
            });
        }
    }, [isAtBottom])

    useEffect(() => {
        if (activePanel !== "newGroup") {
            setGroupsOnly(true)
        } else {
            setGroupsOnly(false)
        }
    }, [activePanel])

    useEffect(() => {
        if (scrollToBottomInChat) {
            scrollToBottom();
            setScrollToBottomInChat(false);
        }
    }, [scrollToBottomInChat])

    const searchUsers = async (query) => {
        setQuery(query);
        try {
            const response = await userApi.searchUsers(query);
            if (response.success) {
                setUserSearch(response.data);
            }
        } catch (error) {
            console.log("Error while searching users :", error);
        }
    }

    const handleTyping = (e) => {
        const value = e.target.value;
        setMessage(value);

        if (!socket || !context.currentChatUser || !currentChatId) return;

        if (!isTypingRef.current) {
            socket.emit(socketEvents.TYPING, {
                chatId: currentChatId,
                isTyping: true,
            });
            isTypingRef.current = true;
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit(socketEvents.TYPING, {
                chatId: currentChatId,
                isTyping: false,
            });
            isTypingRef.current = false;
        }, 2000);
    };

    return (
        <>
            <div className="flex h-[100dvh] w-full bg-background text-text-primary overflow-hidden fixed inset-0">

                {/* SIDEBAR */}
                <Sidebar
                    activePanel={activePanel}
                    setActivePanel={setActivePanel}
                    query={query}
                    setQuery={setQuery}
                    users={users}
                    chatUsersInfo={chatUsersInfo}
                    searchUsers={searchUsers}
                />
                {/* MAIN CHAT WINDOW */}
                <div className="relative flex flex-col flex-1 h-full max-h-full bg-surface-800 overflow-hidden hidden md:flex">

                    {context.currentChatUser ? (
                        <>
                            {/* Nav Header */}
                            <nav className="flex-shrink-0 sticky top-0 z-20 flex items-center gap-3 h-14 px-5 border-b border-border bg-surface-800">
                                <Avatar
                                    src={context.currentChatUser.avtar}
                                    name={context.currentChatUser.username}
                                    size="md"
                                    online={onlineStatus[context.currentChatUser._id]}
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold tracking-tight text-text-primary truncate">
                                        {context.currentChatUser.username}
                                    </span>
                                    {chatUsersInfo[currentChatId]?.typing ? (
                                        <span className="flex items-center gap-1.5 text-xs text-success font-medium">
                                            <TypingDots />
                                            typing
                                        </span>
                                    ) : (
                                        <span className="text-xs text-text-muted">
                                            {onlineStatus[context.currentChatUser._id] ? 'Online' : 'Offline'}
                                        </span>
                                    )}
                                </div>
                            </nav>

                            {isMedia ? (
                                <MediaPreview
                                    handleSend={handleSend}
                                    message={message}
                                    setMessage={setMessage}
                                />
                            ) : currentPreviewFile ? (
                                <SingleFilePreview />
                            ) : (
                                <>
                                    {/* Messages */}
                                    <div
                                        ref={chatContainerRef}
                                        className="flex-1 overflow-y-auto px-3 md:px-6 pt-4 md:pt-6 pb-2 custom-scroll"
                                    >
                                        <div ref={topSentinelRef} className="h-1 w-full" />

                                        {paginationMeta[currentChatId]?.isLoadingMore && (
                                            <div className="flex items-center justify-center py-3">
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-700 border border-border">
                                                    <Loader2 size={13} className="loading-spinner text-accent-light" />
                                                    <span className="text-xs font-medium text-text-muted">Loading older messages…</span>
                                                </div>
                                            </div>
                                        )}

                                        {paginationMeta[currentChatId]?.hasMore === false && messages[currentChatId]?.length > 0 && !paginationMeta[currentChatId]?.isLoadingMore && (
                                            <div className="flex items-center justify-center py-3 mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-px w-12 bg-border" />
                                                    <span className="text-xs font-medium text-text-muted">Beginning of conversation</span>
                                                    <div className="h-px w-12 bg-border" />
                                                </div>
                                            </div>
                                        )}

                                        {(Array.isArray(messages[currentChatId]) ? messages[currentChatId] : []).map((msg) => (
                                            <Message key={msg._id} msg={msg} />
                                        ))}

                                        {!isAtBottom && (
                                            <button
                                                type="button"
                                                onClick={scrollToBottom}
                                                aria-label="Scroll to bottom"
                                                className="fixed z-20 bottom-24 right-8 w-9 h-9 flex items-center justify-center rounded-full bg-accent text-white shadow-panel transition-all duration-150 hover:-translate-y-0.5 active:scale-95"
                                            >
                                                <ArrowDownCircleIcon size={18} />
                                            </button>
                                        )}

                                        <div ref={messageEndRef} />
                                    </div>

                                    {/* Unread badge */}
                                    {chatUsersInfo[currentChatId]?.newMessages > 0 && (
                                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-accent-light border border-accent/30 bg-accent/15 animate-fade-in shadow-panel">
                                            <MoveDown size={13} />
                                            {chatUsersInfo[currentChatId].newMessages} unread messages
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <footer
                                        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
                                        className="flex-shrink-0 z-20 flex items-center gap-3 h-16 px-5 border-t border-border bg-surface-800"
                                    >
                                        <div className="flex flex-1 items-center gap-2 bg-surface-700 border border-border rounded-sm px-1 pr-1.5 transition-all duration-150 focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/15">
                                            <div className="flex items-center px-1 text-text-muted flex-shrink-0">
                                                <FileUpload />
                                            </div>
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={(e) => handleTyping(e)}
                                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(e)}
                                                placeholder="Type a message…"
                                                className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm py-3 px-2 placeholder:text-text-muted"
                                            />
                                        </div>
                                        <Button
                                            variant="primary"
                                            size="icon"
                                            onClick={handleSend}
                                            disabled={message.trim() === '' && !mediaFiles[currentChatId]?.length}
                                            className="flex-shrink-0"
                                            aria-label="Send message"
                                        >
                                            <Send size={17} />
                                        </Button>
                                    </footer>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                            <div className="flex items-center justify-center w-16 h-16 rounded-md bg-accent/15 border border-accent/25 text-accent-light shadow-subtle">
                                <MessageCircle size={28} />
                            </div>
                            <h1 className="text-md font-semibold tracking-tight text-text-primary">No conversation selected</h1>
                            <p className="text-sm text-text-muted max-w-[260px] text-center leading-relaxed">
                                Pick someone from your conversations to start messaging.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Home
