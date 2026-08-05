import { X, Bell } from "lucide-react"
import React, { useState, useEffect, useCallback } from "react"
import NotificationCard from "./NotificationCard"
import { requestApi } from "../../api/request.api"
import { notificationApi } from "../../api/notification.api"
import { userAuthStore } from "../../store/userStore"
import { socket } from "../../socket/socket"
import { socketEvents } from "../../constants/socketEvents"
import { useChatStore } from "../../store/useChatStore"
import { useRequest } from "../../hooks/useRequest"
import { useNotification } from "../../hooks/useNotification"
import { EmptyState } from "../ui/index.js"

function Notification({ setActivePanel }) {
  const [requests, setRequests] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const user = userAuthStore((state) => state.user)
  const { updateNotificationsCount, incrementNotificationCount, universalInfo } = useChatStore()
  const { acceptRequest } = useRequest()
  const { markAllNotificationsAsRead } = useNotification()

  // Fetch user requests
  const fetchRequests = useCallback(async () => {
    if (!user?._id) return
    setLoading(true)
    const response = await requestApi.getMyRequests()
    if (response.success) {
      setRequests(response.data || [])
    }
  }, [user?._id])

  // Fetch general notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return
    const response = await notificationApi.getMyNotifications()
    if (response.success) {
      setNotifications(response.data?.notifications || [])
    }
  }, [user?._id])

  // Update badge count whenever requests or notifications change
  useEffect(() => {
    updateNotificationsCount(universalInfo.notifications || 0)
  }, [requests, notifications])

  useEffect(() => {
    Promise.all([fetchRequests(), fetchNotifications()]).then(() => {
      setLoading(false)
      // Clear unread highlight once the panel has been viewed
      markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setRequests(prev => prev.map(r => ({ ...r, isRead: true })))
    })
  }, [fetchRequests, fetchNotifications])

  // Listen for new request socket event
  useEffect(() => {
    const handleNewRequest = (newRequest) => {
      setRequests(prev => [newRequest, ...prev])
      incrementNotificationCount(1)
    }

    socket.on(socketEvents.NEW_REQUEST, handleNewRequest)
    return () => {
      socket.off(socketEvents.NEW_REQUEST, handleNewRequest)
    }
  }, [])

  // Listen for new notification socket event
  useEffect(() => {
    const handleNewNotification = (notification) => {
      if (!notification) return
      // Friend requests are emitted as raw request docs (no content/isRead)
      if (notification.type === "DIRECT_CHAT_REQUEST" || (!notification.content && notification.status)) {
        setRequests(prev => [notification, ...prev])
      } else {
        setNotifications(prev => [{ ...notification, isRead: false }, ...prev])
      }
      incrementNotificationCount(1)
    }

    socket.on(socketEvents.NEW_NOTIFICATION, handleNewNotification)
    return () => {
      socket.off(socketEvents.NEW_NOTIFICATION, handleNewNotification)
    }
  }, [])

  const unreadCount = requests.filter(r => r.status === "pending").length + notifications.filter(n => !n.isRead).length

  // Handle accepting a request
  const handleAcceptRequest = async (requestId) => {
    await acceptRequest(requestId)
    setRequests(prev =>
      prev.map(r => r._id === requestId ? { ...r, status: "accepted" } : r)
    )
  }

  // Handle rejecting a request
  const handleRejectRequest = async (requestId) => {
    setRequests(prev =>
      prev.map(r => r._id === requestId ? { ...r, status: "rejected" } : r)
    )
  }

  // Navigate to the notification's context
  const handleClick = (request) => {
    if (request.status === "pending") {
      handleAcceptRequest(request._id)
    }
    setActivePanel(null)
  }

  return (
    <div className="flex flex-col h-full bg-surface-800">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-md font-semibold text-text-primary tracking-tight">Friend Requests</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-subtle text-accent-light">
              {unreadCount}
            </span>
          )}
        </div>

        <button onClick={() => setActivePanel(null)} className="btn-icon w-7 h-7">
          <X size={15} />
        </button>
      </div>

      <div className="h-px bg-border mx-4" />

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto px-2 pt-2 custom-scroll">
        {loading ? (
          <div className="flex items-center justify-center h-full text-sm text-text-muted">
            Loading...
          </div>
        ) : requests.length === 0 && notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="You're all caught up!"
            description="Friend requests and notifications will appear here."
            className="h-full"
          />
        ) : (
          <>
            {requests.map(request => (
              <NotificationCard
                key={request._id}
                notification={{
                  _id: request._id,
                  type: "friend_request",
                  isRead: request.isRead || request.status !== "pending",
                  content: `${request.sender?.username || "Someone"} sent you a friend request`,
                  createdAt: request.createdAt,
                  sender: request.sender,
                  status: request.status
                }}
                senderInfo={request.sender ? {
                  username: request.sender.username,
                  avatar: request.sender.avtar
                } : null}
                onClick={() => handleClick(request)}
                onAccept={() => handleAcceptRequest(request._id)}
                onReject={() => handleRejectRequest(request._id)}
              />
            ))}
            {notifications.length > 0 && notifications.map(notif => (
              <NotificationCard
                key={notif._id}
                notification={notif}
                senderInfo={notif.sender ? {
                  username: notif.sender.username,
                  avatar: notif.sender.avtar
                } : null}
                onClick={() => setActivePanel(null)}
              />
            ))}
          </>
        )}
      </div>

    </div>
  )
}

export default Notification