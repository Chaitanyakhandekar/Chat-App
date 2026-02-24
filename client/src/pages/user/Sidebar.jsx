import React, { useState } from 'react'
import { userAuthStore } from '../../store/userStore'
import { useChatStore } from '../../store/useChatStore'

function Sidebar() {


        const [query, setQuery] = useState("")

    const { user } = userAuthStore()

    const users = useChatStore(state => state.userChats)
    const setUsers = useChatStore(state => state.setUserChats)

    const {
        userSearch,
        setUserSearch,
        chatUsersInfo,
        setChatUsersInfo,
        onlineStatus,
        incrementNewMessagesCountByN
    } = useChatStore()

  return (    <div className="sidebar-accent relative flex flex-col w-80 min-w-[280px] h-screen bg-[#0e1018] border-r border-white/[0.06]">

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
                            />
                        ))}
                        {query && userSearch?.map((chat) => (
                            <ChatCard key={chat._id} user={chat} searchMode={true} />
                        ))}
                    </div>
                </div>
  )
}

export default Sidebar