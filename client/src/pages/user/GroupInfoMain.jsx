import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { userApi } from '../../api/user.api.js'
import { useContext } from 'react'
import { authContext } from '../../context/AuthProvider.jsx'
import { socket } from '../../socket/socket.js'
import {
    MessageCircle,
    Send,
    MoveDown,
    ArrowDownCircleIcon
} from 'lucide-react'
import Message from '../../components/message/Message.jsx'
import { messageApi } from '../../api/message.api.js'
import { useChatStore } from '../../store/useChatStore.js'
import { chatApi } from '../../api/chat.api.js'
import { userAuthStore } from '../../store/userStore.js'
import { socketEvents } from '../../constants/socketEvents.js'
import { useAssetsStore } from '../../store/useAssetsStore.js'
import { useGroupChatStore } from '../../store/useGroupChatStore.js'
import FileUpload from '../../components/message/FileUpload.jsx'
import MediaPreview from '../../components/message/MediaPreview.jsx'
import SingleFilePreview from '../../components/message/SingleFilePreview.jsx'
import GroupInfo from '../../components/user/GroupInfo.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import { groupApi } from '../../api/group.api.js'
import { Avatar, Button, TypingDots } from '../../components/ui/index.js'

function GroupInfoMain() {

    const context = useContext(authContext);
    const [message, setMessage] = React.useState("")
    const [query, setQuery] = React.useState("")

    // Panel state: null | 'notifications' | 'profile' | 'newGroup' | 'settings'
    const [activePanel, setActivePanel] = useState("groupInfo")

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
        groupChat,
    } = useChatStore()

    const {
        scrollToBottomInChat,
        setScrollToBottomInChat
    } = useAssetsStore()

    const {
        setCurrentGroupParticipants
    } = useGroupChatStore()

    const typingTimeoutRef = useRef(null);
    const paramChatId = useParams().id
    const isTypingRef = useRef(false);
    const messageEndRef = useRef(null);
    const chatContainerRef = useRef(null)
    const [isAtBottom, setIsAtBottom] = React.useState(true);
    const isMedia = mediaFiles[currentChatId || paramChatId]?.length > 0
    const [, setGroupsOnly] = useState(false)
    const navigate = useNavigate()
    const groupId = useParams().id;
    const [group, setGroup] = useState(null)

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
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()

        if (message.trim() === "" && !mediaFiles[currentChatId].length) {
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

    const getMembers = async () => {
        const res = await groupApi.getGroupMembers(groupId);
        if (res.success) {
            setCurrentGroupParticipants(res.data);
        }
    }

    const getChat = async () => {
        const res = await chatApi.getChatById(groupId);
        if (res.success) {
            setGroup(res.data)
        }
    }

    useEffect(() => {
        getAllUsers();
        getChat();
        getMembers();

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

    const handleChatInfoClick = () => {
        if (isGroupChat) {
            setActivePanel("groupInfo")
        }
    }

    return (
        <>
            {/* Root */}
            <div className="flex h-[100dvh] bg-background text-text-primary overflow-hidden fixed inset-0">

                {/* ── SIDEBAR ── */}
                <Sidebar
                    activePanel={activePanel}
                    setActivePanel={setActivePanel}
                    query={query}
                    setQuery={setQuery}
                    users={users}
                    chatUsersInfo={chatUsersInfo}
                    hideOnMobile={true}
                    paramChatId={paramChatId}
                    searchUsers={searchUsers}
                />

                {/* ── MAIN CHAT WINDOW ── */}
                {
                    activePanel === "groupInfo" ? <GroupInfo
                        setActivePanel={setActivePanel}
                        group={group}
                        user={user}
                    /> :

                        <div className="relative flex flex-col flex-1 h-full max-h-full bg-surface-800 overflow-hidden md:flex">

                            {context.currentChatUser ? (
                                <>
                                    {/* Nav */}
                                    <nav
                                        title={isGroupChat ? 'Group Info' : "User Profile"}
                                        onClick={handleChatInfoClick}
                                        className="flex-shrink-0 sticky top-0 z-20 flex items-center gap-3 h-14 px-5 border-b border-border bg-surface-800 cursor-pointer"
                                    >
                                        <Avatar
                                            src={context.currentChatUser.avtar}
                                            name={context.currentChatUser?.username || (isGroupChat ? groupChat?.groupName : "Unknown User")}
                                            size="md"
                                            online={onlineStatus[context.currentChatUser._id]}
                                        />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-semibold tracking-tight text-text-primary truncate">
                                                {context.currentChatUser?.username || (isGroupChat ? groupChat?.groupName : "Unknown User")}
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
                                    ) :

                                        currentPreviewFile ? (
                                            <SingleFilePreview />
                                        ) :

                                            (
                                                <>
                                                    {/* Messages */}
                                                    <div
                                                        ref={chatContainerRef}
                                                        className="flex-1 overflow-y-auto px-3 md:px-6 pt-4 md:pt-6 pb-2 custom-scroll"
                                                    >
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
                                                        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
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
                                                            className="flex-shrink-0"
                                                            aria-label="Send message"
                                                        >
                                                            <Send size={18} />
                                                        </Button>
                                                    </footer>
                                                </>
                                            )}
                                </>
                            ) : (
                                /* Empty state */
                                <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-md bg-accent/15 border border-accent/25 text-accent-light shadow-subtle">
                                        <MessageCircle size={28} />
                                    </div>
                                    <h1 className="text-md font-semibold tracking-tight text-text-primary">No conversation selected</h1>
                                    <p className="text-sm text-text-muted max-w-[280px] text-center leading-relaxed">
                                        Pick someone from your conversations to start messaging instantly.
                                    </p>
                                </div>
                            )}
                        </div>
                }
            </div>
        </>
    )
}

export default GroupInfoMain
