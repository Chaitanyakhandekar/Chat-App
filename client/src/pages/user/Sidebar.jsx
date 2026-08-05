import React from "react"
import {
  MessageCircle,
  Bell,
  Users,
  User,
  MessageSquare,
} from "lucide-react"

import Profile from "../../components/user/Profile.jsx"
import ChatList from "./../../components/user/ChatList.jsx"
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
  chatUsersInfo,
  hideOnMobile = false,
  searchUsers = () => { },
  paramChatId = null
}) {

  const togglePanel = (panel) =>
    setActivePanel(prev => prev === panel ? null : panel)
  const { newGroupNotication, resetParticipant } = useGroupChatStore()

  const { universalInfo } = useChatStore()
  const { markAllNotificationsAsRead } = useNotification()


  const NavIconBtn = ({ icon, panel, badge, tooltip, onClick = () => {
    togglePanel(panel)
    resetParticipant()
  } }) => {
    const Icon = icon
    const active = activePanel === panel

    return (
      <button
        onClick={onClick}
        title={tooltip}
        aria-label={tooltip}
        className={`relative flex items-center justify-center w-10 h-10 rounded-sm transition-colors duration-150 group
          ${active
            ? 'bg-accent/15 text-accent-light border border-accent/30'
            : 'text-text-muted hover:bg-surface-hover hover:text-text-secondary border border-transparent'}`}
      >
        <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />

        {badge > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-[18px] h-[18px] rounded-full text-[9px] font-bold text-white bg-accent shadow-sm">
            {badge > 9 ? "9+" : badge}
          </span>
        )}

        <span className="absolute left-full ml-3 px-2.5 py-1 text-xs font-medium text-text-primary bg-surface-700 border border-border rounded-sm whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-panel">
          {tooltip}
        </span>
      </button>
    )
  }

  const MobileNavBtn = ({ icon, panel, badge, label, onClick = () => {
    togglePanel(panel)
    resetParticipant()
  } }) => {
    const Icon = icon
    const active = activePanel === panel

    return (
      <button
        onClick={onClick}
        aria-label={label}
        className="relative flex flex-col items-center justify-center w-16 h-14 rounded-sm transition-colors duration-150"
      >
        <div className="relative flex items-center justify-center w-8 h-8">
          <Icon
            size={20}
            strokeWidth={active ? 2.2 : 1.8}
            className={`transition-colors duration-150 ${active ? 'text-accent-light' : 'text-text-muted'}`}
          />
          {badge > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white bg-accent">
              {badge > 9 ? "9+" : badge}
            </span>
          )}
        </div>
        <span className={`text-[10px] font-medium mt-0.5 transition-colors duration-150 ${active ? 'text-accent-light font-semibold' : 'text-text-muted'}`}>
          {label}
        </span>
      </button>
    )
  }

  return (
    <>
      {/* DESKTOP ICON RAIL */}
      <div className="hidden md:flex flex-col items-center gap-2 w-[60px] min-w-[60px] h-[100dvh] bg-surface-900 border-r border-border pt-4 pb-4 z-30">

        <div className="flex items-center justify-center w-10 h-10 rounded-sm mb-3 bg-accent">
          <MessageSquare size={18} className="text-white" />
        </div>

        <NavIconBtn
          icon={MessageCircle}
          panel="chats"
          tooltip="Chats"
        />

        <NavIconBtn
          onClick={async () => {
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
      <div className={`${hideOnMobile ? 'hidden md:flex' : 'flex'} relative flex flex-col w-full md:w-[320px] md:min-w-[300px] h-[100dvh] pb-[60px] md:pb-0 bg-surface-800 border-r border-border`}>

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

            groupsOnly={true}
            paramChatId={paramChatId}
            searchUsers={searchUsers}
            createGroup={true}
          />
        )}


        {/* Chats */}
        {(activePanel === null ||
          activePanel === "chats") && (

            <ChatList
              togglePanel={setActivePanel}
              activePanel={activePanel}
              query={query}
              setQuery={setQuery}
              users={users}

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

            groupsOnly={true}
            paramChatId={paramChatId}
            searchUsers={searchUsers}
          />

        )}

      </div>

      {/* MOBILE BOTTOM NAV */}
      {!hideOnMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-surface-900 border-t border-border z-[100] flex items-center justify-around px-2"
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
