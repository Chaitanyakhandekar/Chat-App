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
import { useGroupChatStore } from "../../store/useGroupChatStore.js"
import Notification from "../../components/user/Notification.jsx"
import { useChatStore } from "../../store/useChatStore.js"
import { useNotification } from "../../hooks/useNotification.jsx"

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
  searchUsers = () => { },
  paramChatId = null
}) {

  const togglePanel = (panel) =>
    setActivePanel(prev => prev === panel ? null : panel)
  const { setNewGroupInfo, GroupInfo, newGroupNotication, setNewGroupNotification, resetParticipant, participants } = useGroupChatStore()

  const { updateNotificationsCount, universalInfo } = useChatStore()
  const { markAllNotificationsAsRead } = useNotification()


  const NavIconBtn = ({ icon: Icon, panel, badge, tooltip , onClick = () => {
          togglePanel(panel)
          resetParticipant()
          console.log("Clicked Panel :: ", panel)
          console.log("Clicked Panel :: ", participants)
        } }) => {
    const active = activePanel === panel

    return (
      <button
          onClick={onClick}
        title={tooltip}
        className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 group ${active ? 'bg-accent-glow' : 'hover:bg-white/[0.03]'
          }`}
        style={{
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
          className={active ? 'text-accent-light' : 'text-text-dim'}
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

        <span className="absolute left-full ml-2.5 px-2 py-1 text-[11px] font-medium text-text-secondary bg-surface-700 border border-white/[0.08] rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
          {tooltip}
        </span>
      </button>
    )
  }

  const MobileNavBtn = ({ icon: Icon, panel, badge, label, onClick = () => {
    togglePanel(panel)
    resetParticipant()
  } }) => {
    const active = activePanel === panel

    return (
      <button
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center w-16 h-[52px] rounded-2xl transition-all duration-300 ${active ? '' : 'hover:bg-white/[0.02]'}`}
      >
        <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${active ? 'bg-accent/10' : ''}`}
          style={{
            boxShadow: active ? '0 0 12px rgba(99,102,241,0.15)' : 'none',
            border: active ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent'
          }}
        >
          <Icon size={20} className={`transition-all duration-300 ${active ? 'text-accent-light scale-110' : 'text-text-dim/80'}`} />
          {badge > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-[16px] h-[16px] rounded-full text-[8px] font-bold text-white shadow-lg"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "2px solid #1a1d28" }}
            >
              {badge > 9 ? "9+" : badge}
            </span>
          )}
        </div>
        <span className={`text-[9px] font-medium mt-1 transition-colors duration-300 ${active ? 'text-accent-light' : 'text-text-dim/60'}`}>
          {label}
        </span>
      </button>
    )
  }

  return (
    <>
      {/* DESKTOP ICON RAIL */}
      <div className="hidden md:flex flex-col items-center gap-1.5 w-[62px] min-w-[62px] h-[100dvh] bg-surface-900 border-r border-white/[0.05] pt-5 pb-4 z-30">

        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl mb-4 shadow-lg"
          style={{
            background:
              "linear-gradient(135deg,#6366f1,#8b5cf6)",
            boxShadow:
              "0 4px 14px rgba(99,102,241,0.45)"
          }}
        >
          <Zap size={18} className="text-white" />
        </div>

        <NavIconBtn
          icon={MessageCircle}
          panel="chats"
          tooltip="Chats"
        />

        <NavIconBtn
          onClick={async() => {
            await markAllNotificationsAsRead(universalInfo.notifications || 0)
          togglePanel("notifications")
          resetParticipant()
          }}
          icon={Bell}
          panel="notifications"
          badge={universalInfo.notifications}
          tooltip="Notifications"
        />

        <NavIconBtn
          icon={Users}
          panel="newGroup"
          tooltip="New Group"
        />

        <div className="flex-1" />

        <NavIconBtn
          icon={User}
          panel="profile"
          tooltip="Profile"
        />

      </div>


      {/* SIDEBAR PANEL */}
      <div className={`${hideOnMobile ? 'hidden md:flex' : 'flex'} relative flex flex-col w-full md:w-[300px] md:min-w-[280px] h-[100dvh] pb-[68px] md:pb-0 bg-surface-800 border-r border-white/[0.06]`}>

        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-60" />

        {/* Notifications */}
        {activePanel === "notifications" &&
          <Notification
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            chatUsersInfo={chatUsersInfo}
            newGroupNotication={newGroupNotication}
          />
        }

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
            activePanel={activePanel}
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
            activePanel={activePanel}
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
        {/* {activePanel === "settings" &&
          <SettingsPanel
            setActivePanel={setActivePanel}
          />
        } */}


        {/* Chats */}
        {(activePanel === null ||
          activePanel === "chats") && (

            <ChatList
              togglePanel={setActivePanel}
              activePanel={activePanel}
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
            activePanel={activePanel}
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

      {/* MOBILE BOTTOM NAV */}
      {!hideOnMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-surface-900/95 backdrop-blur-xl border-t border-white/[0.05] z-[100] flex items-center justify-around px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.2)]"
             style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <MobileNavBtn
            icon={MessageCircle}
            panel="chats"
            label="Chats"
          />
          <MobileNavBtn
            onClick={async () => {
              await markAllNotificationsAsRead(universalInfo.notifications || 0)
              togglePanel("notifications")
              resetParticipant()
            }}
            icon={Bell}
            panel="notifications"
            badge={universalInfo.notifications}
            label="Alerts"
          />
          <MobileNavBtn
            icon={Users}
            panel="newGroup"
            label="Groups"
          />
          <MobileNavBtn
            icon={User}
            panel="profile"
            label="Profile"
          />
        </div>
      )}
    </>
  )
}

export default Sidebar