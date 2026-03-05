import React from "react"
import {
  MessageCircle,
  Bell,
  Users,
  Settings,
  User,
  Zap,
  X
} from "lucide-react"

import Profile from "../../components/user/Profile.jsx"
import SettingsPanel from "../../components/user/Settings.jsx"
import ChatList from "./../../components/user/ChatList.jsx"
import GroupInfo from ".././../components/user/GroupInfo.jsx"

function Sidebar({
  activePanel,
  setActivePanel,
  query,
  setQuery,
  users,
  setShowSidebar,
  chatUsersInfo,
  totalUnread,
  user,
  hideOnMobile = false,
  searchUsers=()=>{},
  paramChatId = null
}) {

  const togglePanel = (panel) =>
    setActivePanel(prev => prev === panel ? null : panel)

  // Nav button
  const NavIconBtn = ({ icon: Icon, panel, badge, tooltip }) => {
    const active = activePanel === panel

    return (
      <button
        onClick={() => togglePanel(panel)}
        title={tooltip}
        className="relative flex items-center justify-center w-10 h-10 rounded-[13px] transition-all duration-200 group"
        style={{
          background: active
            ? "linear-gradient(135deg,rgba(99,102,241,0.28),rgba(139,92,246,0.18))"
            : "transparent",
          border: active
            ? "1px solid rgba(99,102,241,0.4)"
            : "1px solid transparent",
          boxShadow: active
            ? "0 0 16px rgba(99,102,241,0.18)"
            : "none"
        }}
      >
        <Icon
          size={18}
          color={active ? "#818cf8" : "#4a4e6a"}
        />

        {badge > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-[18px] h-[18px] rounded-full text-[9px] font-bold text-white"
            style={{
              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)"
            }}
          >
            {badge > 9 ? "9+" : badge}
          </span>
        )}

        <span className="absolute left-full ml-2.5 px-2 py-1 text-[11px] font-medium text-[#c4c6e7] bg-[#1a1d28] border border-white/[0.08] rounded-[8px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
          {tooltip}
        </span>
      </button>
    )
  }

  return (
    <>
      {/* ICON RAIL */}
      <div className={`${hideOnMobile ? 'hidden md:flex' : 'flex'} flex-col items-center gap-1.5 w-[62px] min-w-[62px] h-[100dvh] bg-[#0a0b0f] border-r border-white/[0.05] pt-5 pb-4 z-30`}>

        <div
          className="flex items-center justify-center w-9 h-9 rounded-[11px] mb-4"
          style={{
            background:
              "linear-gradient(135deg,#6366f1,#8b5cf6)",
            boxShadow:
              "0 4px 14px rgba(99,102,241,0.45)"
          }}
        >
          <Zap size={15} color="#fff" />
        </div>

        <NavIconBtn
          icon={MessageCircle}
          panel="chats"
          tooltip="Chats"
        />

        <NavIconBtn
          icon={Bell}
          panel="notifications"
          badge={totalUnread}
          tooltip="Notifications"
        />

        <NavIconBtn
          icon={Users}
          panel="newGroup"
          tooltip="New Group"
        />

        <div className="flex-1" />

        <NavIconBtn
          icon={Settings}
          panel="settings"
          tooltip="Settings"
        />

        <NavIconBtn
          icon={User}
          panel="profile"
          tooltip="Profile"
        />

      </div>


      {/* SIDEBAR PANEL */}
      <div className={`${hideOnMobile ? 'hidden md:flex' : 'flex'} sidebar-accent relative flex flex-col w-full md:w-[280px] md:min-w-[260px] h-screen bg-[#0e1018] border-r border-white/[0.06]`}>

        {/* Notifications */}
        {activePanel === "notifications" && (
          <div className="slide-in-panel flex flex-col h-full">

            <div className="flex items-center justify-between px-5 pt-6 pb-4">
              <span className="text-[15px] font-bold">
                Notifications
              </span>

              <button
                onClick={() => setActivePanel(null)}
              >
                <X size={16}/>
              </button>
            </div>

            <div className="panel-divider"/>

            <div className="flex-1 overflow-y-auto px-3 custom-scroll">

              {Object.entries(chatUsersInfo)
                .filter(([,c]) => c?.newMessages > 0)
                .map(([chatId, info]) => {

                  const chat =
                    users?.find(
                      c => c._id === chatId
                    )

                  if(!chat) return null

                  const otherUser =
                    chat.participants[0]._id === user._id
                      ? chat.participants[1]
                      : chat.participants[0]

                  return (
                    <div
                      key={chatId}
                      className="notif-item unread"
                      onClick={() =>
                        setActivePanel(null)
                      }
                    >

                      <img
                        src={otherUser.avtar}
                        className="w-9 h-9 rounded-full"
                      />

                      <div>
                        {otherUser.username}
                      </div>

                    </div>
                  )

                })}

            </div>

          </div>
        )}


        {/* Profile */}
        {activePanel === "profile" &&
          <Profile
            setActivePanel={setActivePanel}
          />
        }


        {/* New Group */}
        {activePanel === "newGroup" && (
          <ChatList
            togglePanel={setActivePanel}
            query={query}
            setQuery={setQuery}
            users={users}
            setShowSidebar={setShowSidebar}
            groupsOnly={true}
            paramChatId={paramChatId}
            searchUsers={searchUsers}
          />
        )}

        {activePanel === "createGroup" && (
          <ChatList
            togglePanel={setActivePanel}
            query={query}
            setQuery={setQuery}
            users={users}
            setShowSidebar={setShowSidebar}
            groupsOnly={true}
            paramChatId={paramChatId}
            searchUsers={searchUsers}
            createGroup={true}
          />
        )}


        {/* Settings */}
        {activePanel === "settings" &&
          <SettingsPanel
            setActivePanel={setActivePanel}
          />
        }


        {/* Chats */}
        {(activePanel === null ||
          activePanel === "chats") && (

          <ChatList
            togglePanel={setActivePanel}
            query={query}
            setQuery={setQuery}
            users={users}
            setShowSidebar={setShowSidebar}
            groupsOnly={false}
            paramChatId={paramChatId}
            searchUsers={searchUsers}
          />

        )}


        {/* Group Info */}
        {activePanel === "groupInfo" && (

          <ChatList
            togglePanel={setActivePanel}
            query={query}
            setQuery={setQuery}
            users={users}
            setShowSidebar={setShowSidebar}
            groupsOnly={true}
            paramChatId={paramChatId}
            searchUsers={searchUsers}
          />

        )}

      </div>
    </>
  )
}

export default Sidebar