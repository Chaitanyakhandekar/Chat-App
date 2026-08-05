import React, { useState } from 'react'
import { ArrowLeft, MoreVertical, Sparkles, Trash2 } from 'lucide-react'
import { Avatar, Button, TypingDots, Menu, MenuItem, MenuSeparator } from '../ui/index.js'
import { getTime } from '../../services/getTime.js'

/**
 * Chat window top bar: avatar, name, typing/presence status and chat options menu.
 * Pure presentation — all actions are passed in as props.
 */
function ChatHeader({
  currentChatUser = null,
  isGroupChat = false,
  groupChat = null,
  onlineStatus = {},
  chatUsersInfo = {},
  currentChatId = null,
  onBack = null,
  onTitleClick = () => {},
  onSummarize = () => {},
  onClearForMe = () => {},
  onClearForEveryone = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  const avatarSrc = isGroupChat && groupChat?.groupPicture
    ? groupChat.groupPicture
    : !isGroupChat && currentChatUser?.avtar
      ? currentChatUser.avtar
      : `https://api.dicebear.com/7.x/shapes/svg?seed=${currentChatUser?._id}&scale=90`

  const typing = chatUsersInfo[currentChatId]?.typing
  const typers = chatUsersInfo[currentChatId]?.typers || []

  const displayName = (!isGroupChat && currentChatUser?.username) || (isGroupChat ? groupChat?.groupName : "Unknown User")

  return (
    <nav className="flex-shrink-0 sticky top-0 z-20 flex items-center gap-2 md:gap-3 h-14 px-3 md:px-5 border-b border-border bg-surface-800/90 backdrop-blur-md">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden flex-shrink-0"
          onClick={onBack}
          aria-label="Back to chats"
        >
          <ArrowLeft size={18} />
        </Button>
      )}

      <div
        title={isGroupChat ? 'Group Info' : "User Profile"}
        onClick={onTitleClick}
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
      >
        <Avatar
          src={avatarSrc}
          name={displayName}
          size="md"
          online={!isGroupChat && !!onlineStatus[currentChatUser?._id]}
        />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold tracking-tight text-text-primary truncate">
            {displayName}
          </span>
          {typing ? (
            <span className="flex items-center gap-1 text-xs text-success font-medium">
              <TypingDots />
              <span className="truncate">
                {typers.map((typer, index) => (
                  <span key={index}>
                    {typer.username || 'Unknown User'}{index < typers.length - 1 ? ', ' : ' '}
                  </span>
                ))}
                typing
              </span>
            </span>
          ) : !isGroupChat ? (
            <span className="text-xs text-text-muted truncate">
              {onlineStatus[currentChatUser?._id]
                ? 'Online'
                : `last active ${getTime(currentChatUser?.lastActive)}`}
            </span>
          ) : (
            <span className="text-xs text-text-muted"></span>
          )}
        </div>
      </div>

      <div className="relative flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Chat options"
        >
          <MoreVertical size={18} />
        </Button>

        <Menu open={menuOpen} onClose={() => setMenuOpen(false)} className="absolute right-0 top-11">
          <MenuItem
            icon={Sparkles}
            onClick={() => { setMenuOpen(false); onSummarize() }}
          >
            AI Summary
          </MenuItem>
          <MenuItem
            icon={Trash2}
            onClick={() => { setMenuOpen(false); onClearForMe() }}
          >
            Clear for Me
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            icon={Trash2}
            danger
            onClick={() => { setMenuOpen(false); onClearForEveryone() }}
          >
            Clear for Everyone
          </MenuItem>
        </Menu>
      </div>
    </nav>
  )
}

export default ChatHeader
