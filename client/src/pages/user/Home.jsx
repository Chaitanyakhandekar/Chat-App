import React, { useRef, useState } from 'react'
import ChatCard from '../../components/user/ChatCard.jsx'
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
    Search,
    Zap
} from 'lucide-react'
import Swal from 'sweetalert2';
import Message from '../../components/message/Message.jsx'
import { messageApi } from '../../api/message.api.js'
import { useChatStore } from '../../store/useChatStore.js'
import { chatApi } from '../../api/chat.api.js'
import { userAuthStore } from '../../store/userStore.js'
import { socketEvents } from '../../constants/socketEvents.js'
import { useAssetsStore } from '../../store/useAssetsStore.js'
import FileUpload from '../../components/message/FileUpload.jsx'
import MediaPreview from '../../components/message/MediaPreview.jsx'

function Home() {

    const context = useContext(authContext);
    const [message, setMessage] = React.useState("")
    const [query, setQuery] = React.useState("")

    const { user } = userAuthStore()

    const users = useChatStore(state => state.userChats)
    const setUsers = useChatStore(state => state.setUserChats)

    const messages = useChatStore(state => state.userMessages)
    const addMessage = useChatStore(state => state.addMessage)
    const currentChatId = useChatStore(state => state.currentChatId)
    const userMessages = useChatStore().userMessages

    const {
        userSearch,
        setUserSearch,
        setChatUsersInfo,
        chatUsersInfo,
        emitedTyping,
        toogleEmitedTyping,
        onlineStatus,
        incrementNewMessagesCount,
        incrementNewMessagesCountByN,
        resetNewMessagesCount,
        mediaFiles,
        removeMessage,
        resetMediaFiles
    } = useChatStore()

    const {
        scrollToBottomInChat,
        setScrollToBottomInChat
    } = useAssetsStore()

    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);
    const messageEndRef = useRef(null);
    const chatContainerRef = useRef(null)
    const [isAtBottom, setIsAtBottom] = React.useState(true);
    const isMedia = mediaFiles[currentChatId]?.length > 0
    const [showSidebar, setShowSidebar] = useState(true)

    const loadUnreadMessages = (chats) => {
        chats.forEach((chat) => {
            incrementNewMessagesCountByN(chat._id, chat.unreadMessagesCount)
        })
    }

    const getAllUsers = async () => {
        const response = await chatApi.getUserChats();
        if (response.success) {
            setUsers(response.data);
            loadUnreadMessages(response.data)
            setChatUsersInfo(response.data)
            console.log("All users fetched:", response.data);
        }
    }

    const getConversationMessages = async (otherUserId) => {
        const messages = await messageApi.getConversation(otherUserId)
    }

    const handleSend = async (e) => {
        e.preventDefault()
        console.log("Send button clicked");

        if (message.trim() === "" && !mediaFiles[currentChatId].length) {
            console.log("Returning Function HandleSend")
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
            createdAt: "2026-02-21T08:49:25.317Z"
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

            console.log("Upload Info :: ", uploadInfo)

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
        }, (ack) => {
            console.log("Ack from server:", ack);
        })

        setMessage("")
    }

    const scrollToBottom = () => {
        const container = chatContainerRef.current;
        if (!container) return;

        container.scrollTop = container.scrollHeight;
    };

    useEffect(() => {
        getAllUsers();
        console.log("Media Files: ", mediaFiles[currentChatId]);

        const container = chatContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const atBottom =
                container.scrollTop + container.clientHeight >=
                container.scrollHeight - 5;
            setIsAtBottom(atBottom);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [])

    useEffect(() => {
        if (!isAtBottom) {
            scrollToBottom()
        }
    }, [setIsAtBottom])

    useEffect(() => {
        console.log("Messages :: ", messages)
    }, [messages])

    useEffect(() => {
        console.log("Scroll to bottom in chat:", scrollToBottomInChat);
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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
                * { font-family: 'Sora', sans-serif; box-sizing: border-box; }

                .typing-dot { animation: blink 1.2s infinite; }
                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                @keyframes blink {
                    0%, 80%, 100% { opacity: 0.2; }
                    40% { opacity: 1; }
                }
                .online-pulse { animation: pulse-dot 2s infinite; }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.15); }
                }
                .float-icon { animation: float 3s ease-in-out infinite; }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .fade-in-up { animation: fadeInUp 0.3s ease; }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateX(-50%) translateY(8px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                .custom-scroll { scrollbar-width: thin; scrollbar-color: #1a1d28 transparent; }
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #1a1d28; border-radius: 4px; }
                .sidebar-accent::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #6366f1, transparent);
                    opacity: 0.6;
                }
                .noise-bg::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
                    pointer-events: none;
                    z-index: 0;
                    opacity: 0.4;
                }
                .search-input:focus {
                    border-color: rgba(99,102,241,0.35) !important;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important;
                }
                .msg-input-wrap:focus-within {
                    border-color: rgba(99,102,241,0.35) !important;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important;
                }
            `}</style>

            {/* Root */}
            <div className="flex h-[100dvh] bg-[#0a0b0f] text-[#f1f2f7] overflow-hidden">

                {/* ── SIDEBAR ── */}
                <div className={`
                    sidebar-accent relative flex flex-col 
                    w-full md:w-80 md:min-w-[280px] 
                    h-screen bg-[#0e1018] border-r border-white/[0.06]
                    ${showSidebar ? 'flex' : 'hidden'} md:flex
                    `}>

                    {/* Brand */}
                    <div className="flex items-center gap-2.5 px-5 pt-6 pb-4">
                        <div
                            className="flex items-center justify-center w-8 h-8 rounded-[10px]"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}
                        >
                            <Zap size={16} color="#fff" />
                        </div>
                        <span className="text-base font-bold tracking-tight">Messages</span>
                    </div>

                    {/* Search */}
                    <div className="relative px-4 pb-4">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#4a4e6a]" size={15} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={query}
                            onChange={(e) => searchUsers(e.target.value)}
                            className="search-input w-full py-[11px] pl-9 pr-4 bg-[#1a1d28] border border-white/[0.06] rounded-[14px] text-[#f1f2f7] text-[13.5px] outline-none placeholder-[#4a4e6a] transition-all duration-200"
                        />
                    </div>

                    {/* Section label */}
                    <p className="px-5 pb-2.5 text-[10.5px] font-semibold tracking-[1.2px] uppercase text-[#4a4e6a]">
                        {!query || query.trim() === "" ? "Conversations" : "Results"}
                    </p>

                    {/* Users */}
                    <div className="flex-1 overflow-y-auto px-2 custom-scroll">
                        {(!query || query.trim() === "") && users?.map((chat) => (
                            <ChatCard
                                key={chat._id}
                                user={chat.participants[0]._id === user._id ? chat.participants[1] : chat.participants[0]}
                                searchMode={false}
                                chatId={chat._id}
                                typing={chatUsersInfo[chat._id]?.typing || false}
                                online={onlineStatus[chat.participants[0]?._id === user?._id ? chat.participants[1]?._id : chat.participants[0]?._id] || false}
                                chat={chat}
                                newMessages={chatUsersInfo[chat?._id].newMessages || 0}
                                time={chatUsersInfo[chat._id].time}
                                setShowSidebar={setShowSidebar}
                            />
                        ))}
                        {query && userSearch?.map((chat) => (
                            <ChatCard key={chat._id} user={chat} searchMode={true} />
                        ))}
                    </div>
                </div>

                {/* ── MAIN CHAT WINDOW ── */}
                <div className={`
                    noise-bg relative flex flex-col flex-1 h-full bg-[#0c0e16] overflow-hidden
                    hidden  md:flex
                      `}>

                    {/* Ambient orbs */}
                    <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
                        style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.08),transparent 70%)', filter: 'blur(80px)' }} />
                    <div className="absolute -bottom-20 left-[10%] w-[300px] h-[300px] rounded-full pointer-events-none z-0"
                        style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)', filter: 'blur(80px)' }} />

                        <div className="relative z-[1] flex flex-col items-center justify-center w-full h-full gap-4">
                            <div
                                className="float-icon flex items-center justify-center w-[72px] h-[72px] rounded-[24px] border border-[rgba(99,102,241,0.35)]"
                                style={{
                                    background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))',
                                    boxShadow: '0 0 30px rgba(99,102,241,0.2)'
                                }}
                            >
                                <MessageCircle size={32} color="#818cf8" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-[#f1f2f7]">No conversation selected</h1>
                            <p className="text-sm text-[#4a4e6a] max-w-[280px] text-center leading-relaxed">
                                Pick someone from your conversations to start messaging instantly.
                            </p>
                        </div>
                    
                </div>
            </div>
        </>
    )
}

export default Home
