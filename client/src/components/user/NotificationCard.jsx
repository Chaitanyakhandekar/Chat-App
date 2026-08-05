import React from "react"
import { UserPlus, AtSign, MessageCircle, ShieldCheck, Bell, Check, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Avatar } from "../ui/index.js"

const NOTIFICATION_CONFIG = {
  group_add: {
    icon: UserPlus,
    text: "text-accent-light",
    bg: "bg-accent-subtle",
    label: "Group Invite",
  },
  mention: {
    icon: AtSign,
    text: "text-danger",
    bg: "bg-danger/15",
    label: "Mentioned you",
  },
  message: {
    icon: MessageCircle,
    text: "text-success",
    bg: "bg-success/15",
    label: "New Message",
  },
  admin_promote: {
    icon: ShieldCheck,
    text: "text-warning",
    bg: "bg-warning/15",
    label: "Promoted to Admin",
  },
  friend_request: {
    icon: UserPlus,
    text: "text-success",
    bg: "bg-success/15",
    label: "Friend Request",
  },
  security: {
    icon: ShieldCheck,
    text: "text-danger",
    bg: "bg-danger/15",
    label: "Security Alert",
  },
  default: {
    icon: Bell,
    text: "text-text-secondary",
    bg: "bg-surface-700",
    label: "Notification",
  },
  notify: {
    icon: Bell,
    text: "text-text-secondary",
    bg: "bg-surface-700",
    label: "Notification",
  }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function NotificationCard({ notification, senderInfo, onClick, onMarkRead, onAccept, onReject }) {
  const { type, content, isRead, createdAt, renderUrl, status } = notification
  const config = NOTIFICATION_CONFIG[type] ?? NOTIFICATION_CONFIG.default
  const Icon = config.icon
  const navigate = useNavigate()

  function handleMarkRead(e) {
    e.stopPropagation()
    onMarkRead?.(notification._id)
  }

  return (
    <div
      onClick={() => {
        onClick?.(notification)
        if (notification?.renderUrl) {
          navigate(notification.renderUrl)
        }
      }}
      className={`relative flex items-start gap-3 p-3 rounded-sm cursor-pointer mb-1 border-l-2 transition-colors duration-150 ${
        isRead ? 'border-l-transparent bg-transparent hover:bg-surface-hover' : 'border-l-accent bg-accent-subtle hover:bg-accent/15'
      }`}
    >
      {/* Avatar + icon badge */}
      <div className="relative flex-shrink-0">
        <Avatar
          src={senderInfo?.avatar}
          name={senderInfo?.username}
          size="md"
        />
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border border-surface-900 ${config.bg} ${config.text}`}
        >
          <Icon size={9.5} strokeWidth={2.4} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 pt-0.5">

        {/* type label + time */}
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase ${config.text}`}
          >
            {config.label}
          </span>
          <span className="text-[10px] text-text-muted flex-shrink-0 ml-2">
            {timeAgo(createdAt)}
          </span>
        </div>

        {/* sender name */}
        {senderInfo?.username && (
          <div className="text-sm font-medium text-text-primary mb-0.5 truncate">
            {senderInfo.username}
          </div>
        )}

        {/* content */}
        <p className="text-xs text-text-muted m-0 leading-relaxed line-clamp-2">
          {content}
        </p>

        {/* Friend request actions */}
        {type === "friend_request" && status === "pending" && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAccept?.()
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-sm bg-success/15 text-success border border-success/30 cursor-pointer text-xs font-medium transition-colors hover:bg-success/25"
            >
              <Check size={12} />
              Accept
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onReject?.()
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-sm bg-danger/15 text-danger border border-danger/30 cursor-pointer text-xs font-medium transition-colors hover:bg-danger/25"
            >
              <X size={12} />
              Reject
            </button>
          </div>
        )}

        {/* CTA link if renderUrl exists */}
        {renderUrl && (
          <span
            className={`inline-block mt-1 text-xs font-medium opacity-85 hover:underline ${config.text}`}
          >
            View →
          </span>
        )}
      </div>

{/* Unread dot */}
          {!isRead && (
            <button
          onClick={handleMarkRead}
          title="Mark as read"
          aria-label="Mark as read"
          className={`flex-shrink-0 mt-1.5 w-2 h-2 rounded-full border-none cursor-pointer p-0 transition-transform duration-150 hover:scale-125 ${config.text}`}
          style={{ background: 'currentColor' }}
        />
      )}
    </div>
  )
}

export default NotificationCard
