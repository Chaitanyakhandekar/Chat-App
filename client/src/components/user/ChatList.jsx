import React from 'react'
import { Search, Plus } from 'lucide-react'
import ChatCard from './ChatCard.jsx'
import { useChatStore } from '../../store/useChatStore.js'
import { userAuthStore } from '../../store/userStore.js'
import CreateGroup from './CreateGroup.jsx'
import { Input, Button } from '../ui/index.js'

function ChatList({
    togglePanel = () => { },
    query = "",
    setQuery = () => { },
    users = [],
    groupsOnly = false,
    searchUsers = () => { },
    createGroup = false,
    activePanel = "chats",
}) {

    const {
        userSearch,
        chatUsersInfo,
        onlineStatus
    } = useChatStore()
    const { user } = userAuthStore();

    const searching = query && query.trim() !== ""

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
                <span className="text-md font-semibold text-text-primary tracking-tight">Messages</span>
                <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() => togglePanel('createGroup')}
                    aria-label="Create Group"
                >
                    <Plus size={15} />
                </Button>
            </div>

            {/* Search */}
            {activePanel === "chats" || activePanel === "newGroup" ? (
                <div className="relative px-3 pb-3">
                    <Input
                        leading={<Search size={14} />}
                        placeholder="Search conversations…"
                        value={query}
                        onChange={(e) => searchUsers(e.target.value)}
                        className="h-9 text-sm"
                    />
                </div>
            ) : null}

            {/* Section label */}
            <p className="px-4 pb-2 text-[10px] font-semibold tracking-[1.2px] uppercase text-text-muted">
                {!searching ? "Conversations" : "Results"}
            </p>

            {/* Users */}
            <div className="flex-1 overflow-y-auto px-2 custom-scroll">
                {(!searching && groupsOnly) && !createGroup && users?.map((chat) => (
                    chat?.isGroupChat ?
                        <ChatCard
                            key={chat._id}
                            user={chat.participants[0]._id === user._id ? chat.participants[1] : chat.participants[0]}
                            searchMode={false}
                            chatId={chat._id}
                            typing={chatUsersInfo[chat._id]?.typing || false}
                            online={
                                !chat.isGroupChat && chat.participants[0]?._id === user?._id ? onlineStatus[chat.participants[1]?._id] : onlineStatus[chat.participants[0]?._id] || false
                            }
                            chat={chat}
                            newMessages={chatUsersInfo[chat?._id].newMessages || 0}
                            time={chatUsersInfo[chat._id].time}

                        /> : <></>
                ))}
                {(!searching && !groupsOnly) && !createGroup && users?.map((chat) => (
                    !chat.isGroupChat ?
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

                        /> : <></>
                ))}

                {(!searching && !groupsOnly) && !createGroup && users.length === 0 && (
                    <p className="text-center text-text-muted text-sm py-8">No conversations yet</p>
                )}

                {searching && !createGroup && userSearch?.map((chat) => (
                    <ChatCard key={chat._id} user={chat} searchMode={true} setQuery={setQuery} />
                ))}

                {
                    createGroup && (
                        <CreateGroup users={users} setActivePanel={togglePanel} />
                    )
                }
            </div>
        </>
    )
}

export default ChatList
