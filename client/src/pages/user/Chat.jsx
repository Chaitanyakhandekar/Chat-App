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
    ArrowLeft,
    Sparkles,
    Copy,
    Check,
    Loader2,
    X,
} from 'lucide-react'
import Swal from 'sweetalert2';
import Message from '../../components/message/Message.jsx'
import { messageApi } from '../../api/message.api.js'
import { useChatStore } from '../../store/useChatStore.js'
import { chatApi } from '../../api/chat.api.js'
import { userAuthStore } from '../../store/userStore.js'
import { socketEvents } from '../../constants/socketEvents.js'
import { useAssetsStore } from '../../store/useAssetsStore.js'
import MediaPreview from '../../components/message/MediaPreview.jsx'
import SingleFilePreview from '../../components/message/SingleFilePreview.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import { useGroupChatStore } from '../../store/useGroupChatStore.js'
import { groupApi } from '../../api/group.api.js'
import ChatHeader from '../../components/user/ChatHeader.jsx'
import MessageComposer from '../../components/message/MessageComposer.jsx'
import { Button, Skeleton, EmptyState, Badge } from '../../components/ui/index.js'

function SummaryDrawer({ isOpen, onClose, isLoading, summary }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        if (!summary) return
        const text = `Summary\n\n${summary.overview}\n\nKey Points:\n${summary.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/60"
                style={{
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'opacity 0.2s cubic-bezier(0.16,1,0.3,1)',
                }}
            />

            {/* Drawer */}
            <div
                className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px] bg-surface-900 border-l border-border flex flex-col overflow-y-auto custom-scroll shadow-overlay"
                style={{
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0 bg-surface-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-sm bg-accent-subtle border border-accent/30 flex items-center justify-center">
                            <Sparkles size={16} className="text-accent-light" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-text-primary">AI Summary</div>
                            <div className="text-xs text-text-muted">Powered by AI assistant</div>
                        </div>
                    </div>
                    <div className="flex gap-1.5 items-center">
                        {summary && !isLoading && (
                            <Button variant="ghost" size="iconSm" onClick={handleCopy} aria-label="Copy summary">
                                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                            </Button>
                        )}
                        <Button variant="ghost" size="iconSm" onClick={onClose} aria-label="Close summary">
                            <X size={14} />
                        </Button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-5 flex flex-col gap-4">

                    {/* Loading skeleton */}
                    {isLoading && (
                        <div className="flex flex-col gap-3">
                            <div className="rounded-md bg-surface-800 border border-border p-4 flex flex-col gap-2.5">
                                <Skeleton className="w-20 h-2.5" />
                                {[1, 0.7, 0.85].map((w, i) => (
                                    <Skeleton key={i} className="h-2" style={{ width: `${w * 100}%`, animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                            <div className="rounded-md bg-surface-800 border border-border p-4 flex flex-col gap-2.5">
                                {[0.9, 0.75, 0.8, 0.65].map((w, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <Skeleton className="w-1.5 h-1.5 rounded-full" />
                                        <Skeleton className="h-2" style={{ width: `${w * 100}%`, animationDelay: `${i * 0.12}s` }} />
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-xs text-text-muted pt-2">Analyzing conversation…</p>
                        </div>
                    )}

                    {/* Summary content */}
                    {!isLoading && summary && (
                        <>
                            {/* Stats row */}
                            <div className="flex gap-2.5">
                                {[
                                    { label: 'Messages', value: summary.messages },
                                    { label: 'Timespan', value: summary.timespan },
                                    { label: 'Tone', value: summary.sentiment },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex-1 p-3 rounded-md bg-surface-800 border border-border flex flex-col gap-1">
                                        <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">{label}</span>
                                        <span className="text-xs text-text-primary font-semibold capitalize">{value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Overview */}
                            <div className="rounded-md bg-accent-subtle border border-accent/25 p-4">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Sparkles size={13} className="text-accent-light" />
                                    <span className="text-[11px] font-bold text-accent-light uppercase tracking-wider">Overview</span>
                                </div>
                                <p className="text-sm text-text-primary leading-relaxed m-0">
                                    {summary.overview}
                                </p>
                            </div>

                            {/* Key points */}
                            <div className="rounded-md bg-surface-800 border border-border p-4">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Key Points</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {summary.keyPoints.map((point, i) => (
                                        <div key={i} className="flex gap-2.5 items-start">
                                            <div className="w-5 h-5 rounded-sm bg-accent-subtle flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-accent-light mt-0.5">
                                                {i + 1}
                                            </div>
                                            <p className="m-0 text-sm text-text-secondary leading-relaxed">
                                                {point}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer note */}
                            <p className="text-center text-xs text-text-muted pt-1">
                                Summary generated from recent conversation history
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

function Chat() {

    const context = useContext(authContext);
    const [message, setMessage] = React.useState("")
    const [query, setQuery] = React.useState("")

    const [activePanel, setActivePanel] = useState("chats")

    // ── Summary state ──────────────────────────────────────────────────
    const [summaryOpen, setSummaryOpen] = useState(false)
    const [summaryLoading, setSummaryLoading] = useState(false)
    const [summaryData, setSummaryData] = useState(null)

    const handleClearForMe = async () => {
        const activeChatId = currentChatId || paramChatId
        if (!activeChatId) return

        const result = await Swal.fire({
            title: 'Clear for me?',
            text: "This will delete all messages for you in this chat.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#5e647e',
            confirmButtonText: 'Yes, clear for me'
        })

        if (result.isConfirmed) {
            const response = await messageApi.clearChat(activeChatId)
            if (response.success) {
                setUserMessages(activeChatId, [])
            }
        }
    }

    const handleClearForEveryone = async () => {
        const activeChatId = currentChatId || paramChatId
        if (!activeChatId) return

        const result = await Swal.fire({
            title: 'Clear for Everyone?',
            text: "This will delete all messages for both participants in real-time.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#5e647e',
            confirmButtonText: 'Yes, clear for everyone'
        })

        if (result.isConfirmed) {
            if (socket) {
                socket.emit(socketEvents.CLEAR_CHAT_FOR_EVERYONE, { chatId: activeChatId })
            }
            const response = await messageApi.clearChatForEveryone(activeChatId)
            if (response.success) {
                setUserMessages(activeChatId, [])
            }
        }
    }

    const handleSummarize = async () => {
        setSummaryOpen(true)
        if (summaryData) return // already loaded, just reopen
        setSummaryLoading(true)
        const response = await chatApi.getSummarizedChat(currentChatId || paramChatId)
        if (response.success) {
            setSummaryData(response.data)
            setSummaryLoading(false)
        }
    }

    const { user } = userAuthStore()

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
        isReplying,
        setIsReplying,
        messageBeingReplied,
        setMessageBeingReplied,
        setUserMessages,
        paginationMeta,
        setPaginationMeta,
        setLoadingMore,
        prependMessages
    } = useChatStore()

    const { setGroupChat, groupChat } = useGroupChatStore();

    const {
        scrollToBottomInChat,
        setScrollToBottomInChat
    } = useAssetsStore()

    const typingTimeoutRef = useRef(null);
    const paramChatId = useParams().id
    const isTypingRef = useRef(false);
    const messageEndRef = useRef(null);
    const chatContainerRef = useRef(null)
    const inputRef = useRef(null)
    const topSentinelRef = useRef(null)
    const [isAtBottom, setIsAtBottom] = React.useState(true);
    const isMedia = mediaFiles[currentChatId || paramChatId]?.length > 0
    const [, setGroupsOnly] = useState(false)
    const navigate = useNavigate()
    const [chatLoading, setChatLoading] = useState(true)
    const chatRestoredRef = useRef(false)

    useEffect(() => {
        if (!chatLoading && paramChatId && !context.currentChatUser) {
            const timeout = setTimeout(() => {
                if (!context.currentChatUser) navigate('/')
            }, 5000)
            return () => clearTimeout(timeout)
        }
    }, [chatLoading, paramChatId, context.currentChatUser])

    const loadUnreadMessages = (chats) => {
        chats.forEach((chat) => {
            incrementNewMessagesCountByN(chat._id, chat.unreadMessagesCount)
        })
    }

    const setCurrentChatId = useChatStore(state => state.setCurrentChatId)
    const setIsGroupChat = useChatStore(state => state.setIsGroupChat)

    const loadMessages = async (chat) => {
        if (!chat) return
        const chatId = chat._id

        if (chat.isGroupChat) {
            const response = await groupApi.getConversation(chatId)
            if (response?.data?.data) {
                const payload = response.data.data
                const msgs = payload.messages || payload
                const hasMore = payload.hasMore ?? false
                const nextCursor = payload.nextCursor ?? null
                setUserMessages(chatId, Array.isArray(msgs) ? msgs : [])
                setPaginationMeta(chatId, { hasMore: !!hasMore, nextCursor, isLoadingMore: false })
            }
        } else {
            const otherParticipant = chat.participants?.find(p => p._id !== user?._id) || chat.participants?.[0]
            if (otherParticipant?._id) {
                const response = await messageApi.getConversation(otherParticipant._id)
                if (response?.data?.data) {
                    const payload = response.data.data
                    const msgs = payload.messages || payload
                    const hasMore = payload.hasMore ?? false
                    const nextCursor = payload.nextCursor ?? null
                    setUserMessages(chatId, Array.isArray(msgs) ? msgs : [])
                    setPaginationMeta(chatId, { hasMore: !!hasMore, nextCursor, isLoadingMore: false })
                }
            }
        }
    }

    const applyChatFromData = async (chat) => {
        if (!chat) return false

        setCurrentChatId(chat._id)

        if (chat.isGroupChat) {
            setIsGroupChat(true)
            setGroupChat(chat)
            const otherParticipant = chat.participants?.find(p => p._id !== user._id) || chat.participants?.[0]
            context.setCurrentChatUser(otherParticipant)
        } else {
            setIsGroupChat(chat.isGroupChat)
            const otherParticipant = chat.participants?.find(p => p._id !== user._id) || chat.participants?.[0]
            context.setCurrentChatUser(otherParticipant)
        }

        await loadMessages(chat)
        setScrollToBottomInChat(true)
        return true
    }

    const restoreChatFromUrl = async (chats) => {
        if (!paramChatId) {
            setChatLoading(false)
            return
        }
        if (chatRestoredRef.current) {
            setChatLoading(false)
            return
        }
        chatRestoredRef.current = true

        const chat = chats.find(c => c._id === paramChatId)
        if (chat) {
            await applyChatFromData(chat)
            setChatLoading(false)
            return
        }

        try {
            const response = await chatApi.getChatById(paramChatId)
            if (response.success && response.data) {
                await applyChatFromData(response.data)
            }
        } catch { /* restore fallback handled by chat list */ }
        setChatLoading(false)
    }

    const getAllUsers = async () => {
        try {
            const response = await chatApi.getUserChats();
            if (response.success) {
                setUsers(response.data);
                loadUnreadMessages(response.data)
                setChatUsersInfo(response.data)
                await restoreChatFromUrl(response.data)
            } else {
                if (paramChatId) {
                    try {
                        const response = await chatApi.getChatById(paramChatId)
                        if (response.success && response.data) {
                            await applyChatFromData(response.data)
                        }
                    } catch { /* single chat may be gone */ }
                }
                setChatLoading(false)
            }
        } catch (error) {
            console.error("Failed to fetch chats:", error)
            if (paramChatId) {
                try {
                    const response = await chatApi.getChatById(paramChatId)
                    if (response.success && response.data) {
                        await applyChatFromData(response.data)
                    }
                } catch { /* single chat may be gone */ }
            }
            setChatLoading(false)
        }
    }

    const handleCancelReply = () => {
        setIsReplying(false)
        setMessageBeingReplied(null)
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
            createdAt: new Date().toISOString(),
            ...(isReplying && messageBeingReplied ? { replyTo: messageBeingReplied } : {})
        })

        setScrollToBottomInChat(true);

        if (isReplying) handleCancelReply()

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

        if (isReplying && messageBeingReplied) {
            socket.emit(socketEvents.MESSAGE_REPLY_SINGLE_CHAT, {
                message: message || "",
                attachments: uploadInfo?.data || [],
                receiver: context.currentChatUser._id,
                chatId: currentChatId || null,
                tempId: tempId,
                replyTo: messageBeingReplied || null
            })
        }
        else if (isGroupChat) {
            socket.emit(socketEvents.NEW_MESSAGE_GROUP, {
                message: message || "",
                attachments: uploadInfo?.data || [],
                chatId: currentChatId || null,
                tempId: tempId,
            })
        }
        else {
            socket.emit(socketEvents.NEW_MESSAGE, {
                message: message || "",
                attachments: uploadInfo?.data || [],
                receiver: context.currentChatUser._id,
                chatId: currentChatId || null,
                tempId: tempId,
            })
        }

        setMessage("")
    }

    const scrollToBottom = () => {
        const container = chatContainerRef.current;
        if (!container) return;
        container.scrollTop = container.scrollHeight;
    };

    const loadOlderMessages = useCallback(async () => {
        const activeChatId = currentChatId || paramChatId
        if (!activeChatId) return
        const meta = paginationMeta[activeChatId]
        if (!meta?.hasMore || meta?.isLoadingMore) return

        setLoadingMore(activeChatId, true)

        const container = chatContainerRef.current
        const prevScrollHeight = container?.scrollHeight || 0

        try {
            const chatState = useChatStore.getState()
            const chat = chatState.userChats.find(c => c._id === activeChatId)
            let response

            if (isGroupChat) {
                response = await groupApi.getConversation(activeChatId, meta.nextCursor)
            } else {
                const otherParticipant = chat?.participants?.find(p => p._id !== user._id) || context.currentChatUser
                if (otherParticipant?._id) {
                    response = await messageApi.getConversation(otherParticipant._id, meta.nextCursor)
                }
            }

            if (response?.data?.data) {
                const { messages: olderMsgs, hasMore, nextCursor } = response.data.data
                if (olderMsgs?.length > 0) {
                    prependMessages(activeChatId, olderMsgs)

                    requestAnimationFrame(() => {
                        if (container) {
                            const newScrollHeight = container.scrollHeight
                            container.scrollTop = newScrollHeight - prevScrollHeight
                        }
                    })
                }
                setPaginationMeta(activeChatId, { hasMore: !!hasMore, nextCursor: nextCursor || null, isLoadingMore: false })
            } else {
                setLoadingMore(activeChatId, false)
            }
        } catch (error) {
            console.error("Error loading older messages:", error)
            setLoadingMore(activeChatId, false)
        }
    }, [currentChatId, paramChatId, paginationMeta, isGroupChat])

    useEffect(() => {
        const handleReconnect = () => {
            const activeChatId = currentChatId || paramChatId
            if (activeChatId && context.currentChatUser) {
                const chatState = useChatStore.getState()
                const chat = chatState.userChats.find(c => c._id === activeChatId)
                if (chat) loadMessages(chat)
            }
        }
        if (socket) {
            socket.on('connect', handleReconnect)
            return () => socket.off('connect', handleReconnect)
        }
    }, [currentChatId, paramChatId, context.currentChatUser])

    useEffect(() => {
        if (isReplying && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isReplying])

    useEffect(() => {
        getAllUsers();
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
        if (isAtBottom && messages[currentChatId]?.length > 0) {
            requestAnimationFrame(() => {
                scrollToBottom();
            });
        }
    }, [messages[currentChatId]?.length])

    useEffect(() => {
        if (activePanel === "newGroup" || activePanel === "groupInfo") {
            setGroupsOnly(true)
        } else {
            setGroupsOnly(false)
        }

        switch (activePanel) {
            case "newGroup":
                setGroupsOnly(false)
                break;
            default:
                setGroupsOnly(true)
                break;
            case "groupInfo":
                navigate(`/chat/group-info/${currentChatId}`)
        }
    }, [activePanel])

    useEffect(() => {
        if (scrollToBottomInChat) {
            requestAnimationFrame(() => {
                scrollToBottom();
            });
            setScrollToBottomInChat(false);
        }
    }, [scrollToBottomInChat])

    useEffect(() => {
        setSummaryData(null)
        setSummaryOpen(false)
    }, [currentChatId])

    useEffect(() => {
        if (currentChatId && messages[currentChatId]?.length > 0) {
            const timer = setTimeout(() => scrollToBottom(), 150)
            return () => clearTimeout(timer)
        }
    }, [currentChatId, chatLoading])

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

    const handleGroupTyping = (e) => {
        const value = e.target.value;
        setMessage(value);

        if (!socket || !context.currentChatUser || !currentChatId) return;

        if (!isTypingRef.current) {
            socket.emit(socketEvents.TYPING_GROUP, {
                chatId: currentChatId,
                isTyping: true,
            });
            isTypingRef.current = true;
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit(socketEvents.TYPING_GROUP, {
                chatId: currentChatId,
                isTyping: false,
            });
            isTypingRef.current = false;
        }, 2000);
    }

    const handleSingleTyping = (e) => {
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
    }

    const handleTyping = (e) => {
        if (isGroupChat) {
            handleGroupTyping(e)
        }
        if (!isGroupChat) {
            handleSingleTyping(e)
        }
    };

    const handleChatInfoClick = () => {
        if (isGroupChat) {
            setActivePanel("groupInfo")
        }
    }

    // Loading skeleton
    const ChatSkeleton = () => (
        <div className="flex flex-col w-full h-full">
            <div className="flex items-center gap-3 h-14 px-4 md:px-6 border-b border-border bg-surface-800">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex flex-col gap-1.5 flex-1">
                    <Skeleton className="w-28 h-3" />
                    <Skeleton className="w-16 h-2.5" />
                </div>
            </div>
            <div className="flex-1 px-4 md:px-6 pt-6 flex flex-col gap-3">
                {[0.4, 0.7, 0.35, 0.55, 0.6, 0.3].map((w, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <Skeleton
                            className="rounded-md"
                            style={{
                                width: `${w * 100}%`,
                                maxWidth: 280,
                                height: 40 + (i % 3) * 12,
                                animationDelay: `${i * 0.12}s`,
                            }}
                        />
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-3 h-16 px-4 md:px-5 border-t border-border bg-surface-800">
                <Skeleton className="flex-1 h-10 rounded-md" />
                <Skeleton className="w-10 h-10 rounded-md" />
            </div>
        </div>
    )

    const activeChatId = currentChatId || paramChatId
    const isLoadingMore = paginationMeta[activeChatId]?.isLoadingMore
    const hasMore = paginationMeta[activeChatId]?.hasMore
    const canSend = message.trim() !== '' || mediaFiles[currentChatId]?.length > 0

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
                    hideOnMobile={true}
                    searchUsers={searchUsers}
                />

                {/* MAIN CHAT WINDOW */}
                <div className="relative flex flex-col flex-1 h-full max-h-full bg-surface-800 overflow-hidden md:flex">

                    {(chatLoading || (paramChatId && !context.currentChatUser)) ? (
                        <ChatSkeleton />
                    ) : context.currentChatUser ? (
                        <>
                            {/* Nav Header */}
                            <ChatHeader
                                currentChatUser={context.currentChatUser}
                                isGroupChat={isGroupChat}
                                groupChat={groupChat}
                                onlineStatus={onlineStatus}
                                chatUsersInfo={chatUsersInfo}
                                currentChatId={currentChatId}
                                onBack={() => navigate('/')}
                                onTitleClick={handleChatInfoClick}
                                onSummarize={handleSummarize}
                                onClearForMe={handleClearForMe}
                                onClearForEveryone={handleClearForEveryone}
                            />

                            {isMedia ? (
                                <MediaPreview
                                    isMedia={isMedia}
                                    handleSend={handleSend}
                                    message={message}
                                    setMessage={setMessage}
                                />
                            ) : currentPreviewFile ? (
                                <SingleFilePreview />
                            ) : (
                                <>
                                    {/* Messages area */}
                                    <div
                                        ref={chatContainerRef}
                                        className="flex-1 overflow-y-auto px-3 md:px-6 pt-4 md:pt-6 pb-2 custom-scroll"
                                    >
                                        <div ref={topSentinelRef} className="h-1 w-full" />

                                        {isLoadingMore && (
                                            <div className="flex items-center justify-center py-3">
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-700 border border-border">
                                                    <Loader2 size={13} className="loading-spinner text-accent-light" />
                                                    <span className="text-xs font-medium text-text-muted">Loading older messages…</span>
                                                </div>
                                            </div>
                                        )}

                                        {!hasMore && messages[currentChatId]?.length > 0 && !isLoadingMore && (
                                            <div className="flex items-center justify-center py-3 mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-px w-12 bg-border" />
                                                    <span className="text-xs font-medium text-text-muted">Beginning of conversation</span>
                                                    <div className="h-px w-12 bg-border" />
                                                </div>
                                            </div>
                                        )}

                                        {(Array.isArray(messages[currentChatId]) ? messages[currentChatId] : []).map((msg) => (
                                            <Message
                                                key={msg._id}
                                                msg={msg}
                                                isGroupChat={isGroupChat}
                                            />
                                        ))}

                                        {!isAtBottom && (
                                            <button
                                                onClick={scrollToBottom}
                                                aria-label="Scroll to bottom"
                                                className="fixed z-20 bottom-24 right-4 md:right-8 w-9 h-9 flex items-center justify-center rounded-full bg-accent text-white shadow-panel transition-all duration-150 active:scale-95"
                                            >
                                                <ArrowDownCircleIcon size={18} />
                                            </button>
                                        )}

                                        <div ref={messageEndRef} />
                                    </div>

                                    {/* Unread badge */}
                                    {chatUsersInfo[currentChatId]?.newMessages > 0 && (
                                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
                                            <Badge variant="accent" className="px-3 py-1.5 text-xs border border-accent/30 shadow-panel">
                                                <MoveDown size={13} />
                                                {chatUsersInfo[currentChatId].newMessages} unread messages
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Composer */}
                                    <MessageComposer
                                        message={message}
                                        onMessageChange={handleTyping}
                                        onSend={handleSend}
                                        canSend={canSend}
                                        isReplying={isReplying}
                                        messageBeingReplied={messageBeingReplied}
                                        onCancelReply={handleCancelReply}
                                        currentChatUser={context.currentChatUser}
                                        userId={user._id}
                                        inputRef={inputRef}
                                    />
                                </>
                            )}
                        </>
                    ) : (
                        <EmptyState
                            icon={MessageCircle}
                            title="No conversation selected"
                            description="Pick someone from your conversations to start messaging."
                            className="w-full h-full"
                        />
                    )}
                </div>
            </div>

            <SummaryDrawer
                isOpen={summaryOpen}
                onClose={() => setSummaryOpen(false)}
                isLoading={summaryLoading}
                summary={summaryData}
            />
        </>
    )
}

export default Chat
