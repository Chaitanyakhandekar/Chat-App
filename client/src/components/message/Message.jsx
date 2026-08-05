import React, { useEffect, useRef, useState, useCallback } from 'react'
import { getTime } from '../../services/getTime'
import {
    CheckIcon,
    CheckCheck,
    Reply,
    Trash2,
    Copy,
    Forward,
    MoreHorizontal,
    X,
    Info,
    ImageIcon,
    ShieldAlert,
    AlertTriangle,
    ExternalLink,
    ShieldX,
    Eye,
} from 'lucide-react'
import { userAuthStore } from '../../store/userStore'
import { socket } from '../../socket/socket'
import { socketEvents } from '../../constants/socketEvents'
import { useChatStore } from '../../store/useChatStore'
import { isThisLink } from '../../services/isThisLink'
import { messageApi } from '../../api/message.api'
import { Modal } from '../ui/index.js'

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏']

function useOutsideClick(ref, handler) {
    useEffect(() => {
        const listener = (e) => {
            if (!ref.current || ref.current.contains(e.target)) return
            handler(e)
        }
        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)
        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [ref, handler])
}

/* ─── Suspicious Warning Banner ───────────────────────────────────────────── */
function SuspiciousWarning({ type = 'link', onDismiss, onProceed, isSent }) {
    const isLink = type === 'link'

    const cfg = {
        link: {
            icon: ShieldX,
            tone: 'danger',
            tag: 'Suspicious Link',
            headline: 'Potentially dangerous link',
            body: 'This URL may lead to a phishing or malware site. Visiting it could compromise your account or device.',
            proceedLabel: 'Open anyway',
        },
        message: {
            icon: AlertTriangle,
            tone: 'warning',
            tag: 'Suspicious Content',
            headline: 'This message looks suspicious',
            body: 'This message contains patterns commonly found in scams or phishing attempts. Be cautious before acting on any requests.',
            proceedLabel: 'Show message',
        },
    }[type]

    const Icon = cfg.icon
    const tone = cfg.tone

    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} px-1 mb-1 animate-fade-in`}>
            <div className="relative max-w-[320px] w-full rounded-sm overflow-hidden bg-surface-800 border border-border shadow-panel">
                {/* Top stripe */}
                <div className={`h-0.5 ${tone === 'danger' ? 'bg-danger' : 'bg-warning'} opacity-70`} />

                <div className="p-3.5">
                    {/* Header row */}
                    <div className="flex items-start gap-2.5 mb-2.5">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center bg-surface-700 border border-border ${tone === 'danger' ? 'text-danger' : 'text-warning'}`}>
                            <Icon size={14} strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${tone === 'danger' ? 'bg-danger/15 text-danger' : 'bg-warning/15 text-warning'}`}>
                                    {cfg.tag}
                                </span>
                            </div>
                            <p className="text-xs font-semibold text-text-primary leading-snug">{cfg.headline}</p>
                        </div>
                        <button type="button" onClick={onDismiss} className="btn-icon w-5 h-5 flex-shrink-0" aria-label="Dismiss warning">
                            <X size={11} />
                        </button>
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed mb-3">{cfg.body}</p>

                    {/* Action row */}
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={onProceed} className="btn-secondary h-8 text-xs px-3">
                            {isLink ? <ExternalLink size={11} /> : <Eye size={11} />}
                            {cfg.proceedLabel}
                        </button>
                        <button type="button" onClick={onDismiss} className="btn-danger h-8 text-xs px-3 flex-1">
                            <ShieldAlert size={11} />
                            Stay safe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ─── Context menu ─── */
function MessageContextMenu({ open, isSent, onAction, onClose, anchorRef }) {
    const menuRef = useRef(null)
    useOutsideClick(menuRef, onClose)
    const [pos, setPos] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (!open || !anchorRef.current || !menuRef.current) return
        const bubble = anchorRef.current.getBoundingClientRect()
        const menu = menuRef.current.getBoundingClientRect()
        const vw = window.innerWidth
        const vh = window.innerHeight
        let top = bubble.bottom + 6
        let left = isSent ? bubble.right - menu.width : bubble.left
        if (top + menu.height > vh - 16) top = bubble.top - menu.height - 6
        if (left + menu.width > vw - 8) left = vw - menu.width - 8
        if (left < 8) left = 8
        setPos({ top, left })
    }, [open])

    if (!open) return null

    const actions = [
        { id: 'reply', icon: Reply, label: 'Reply', always: true },
        { id: 'copy', icon: Copy, label: 'Copy', always: true },
        { id: 'forward', icon: Forward, label: 'Forward', always: true },
        { id: 'info', icon: Info, label: 'Info', onlySent: true },
        { id: 'delete', icon: Trash2, label: 'Delete', onlySent: true, danger: true },
    ].filter(a => a.always || (a.onlySent && isSent))

    return (
        <div
            ref={menuRef}
            className="fixed z-[999] min-w-[160px] rounded-sm overflow-hidden border border-border bg-surface-900 shadow-overlay animate-scale-in"
            style={{ top: pos.top, left: pos.left }}
        >
            {actions.map((a) => (
                <button
                    key={a.id}
                    onClick={() => { onAction(a.id); onClose() }}
                    className={[
                        'flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm font-medium transition-colors duration-100',
                        a.danger ? 'text-danger hover:bg-danger/10' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                        a.id !== actions[0].id ? 'border-t border-border' : ''
                    ].join(' ')}
                >
                    <a.icon size={14} strokeWidth={2} />
                    {a.label}
                </button>
            ))}
        </div>
    )
}

/* ─── Emoji bar ─── */
function EmojiBar({ show, isSent, onPick }) {
    if (!show) return null
    return (
        <div
            className={[
                'absolute -top-9 flex items-center gap-0.5 px-2 py-1 rounded-full border border-border bg-surface-900 shadow-panel z-10 animate-scale-in',
                isSent ? 'right-0' : 'left-0',
            ].join(' ')}
        >
            {QUICK_EMOJIS.map((em) => (
                <button key={em} onClick={() => onPick(em)}
                    className="w-7 h-7 flex items-center justify-center text-base rounded-full hover:bg-surface-hover transition-all duration-100 hover:scale-125 active:scale-110">
                    {em}
                </button>
            ))}
        </div>
    )
}

/* ─── Reaction chips ─── */
function ReactionChips({ reactions = [], isSent, msg }) {
    if (!reactions || reactions.length === 0) return null
    const grouped = reactions.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1
        return acc
    }, {})
    return (
        <div className={`flex flex-wrap gap-1 mt-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
            {reactions && reactions.length > 0 && Object.entries(grouped).map(([emoji, count]) => (
                <span key={emoji} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-border bg-surface-900 text-text-secondary shadow-subtle">
                    {emoji || msg.reactions[0]?.emoji} {count > 1 && <span className="text-[10px] font-bold text-accent-light">{count}</span>}
                </span>
            ))}
        </div>
    )
}

/* ─── Reply Quote ─── */
function ReplyQuote({ reply, isSent }) {
    if (!reply) return null

    const hasThumb = reply?.attachments?.length > 0
    const thumbUrl = hasThumb
        ? (reply.attachments[0]?.secure_url || reply.attachments[0]?.preview)
        : null
    const hasText = reply?.message?.trim()

    return (
        <div
            className={[
                'mx-2.5 mt-2.5 mb-1.5 rounded-sm overflow-hidden flex items-stretch',
                'cursor-pointer select-none transition-opacity duration-150 active:opacity-70',
                'border-l-[3px]',
                isSent ? 'bg-black/20 border-white/40' : 'bg-surface-900/60 border-accent',
            ].join(' ')}
        >
            <div className="flex flex-col justify-center flex-1 min-w-0 px-2.5 py-1.5">
                <span className={[
                    'flex items-center gap-1 text-[10px] font-bold leading-none mb-1',
                    isSent ? 'text-white/70' : 'text-accent-light'
                ].join(' ')}>
                    <Reply size={9} strokeWidth={2.8} style={{ transform: 'scaleX(-1)', flexShrink: 0 }} />
                    {reply.senderName || 'Message'}
                </span>
                <span className={[
                    'text-xs leading-snug truncate',
                    isSent ? 'text-white/60' : 'text-text-muted'
                ].join(' ')}>
                    {hasThumb ? (
                        <span className="inline-flex items-center gap-1">
                            <ImageIcon size={10} strokeWidth={2} style={{ flexShrink: 0, opacity: 0.75 }} />
                            {hasText ? reply.message : 'Photo'}
                        </span>
                    ) : (
                        reply.message
                    )}
                </span>
            </div>
            {thumbUrl && (
                <div className="w-[44px] flex-shrink-0 self-stretch">
                    <img src={thumbUrl} alt="" className="w-full h-full object-cover" draggable={false} />
                </div>
            )}
        </div>
    )
}

/* ─── Delete modal ─── */
function DeleteModal({ show, onClose, onDeleteForMe, onDeleteForEveryone }) {
    return (
        <Modal open={show} onClose={onClose}>
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-md font-semibold text-text-primary tracking-tight">Delete message?</h3>
                    <button type="button" onClick={onClose} className="btn-icon w-7 h-7" aria-label="Close">
                        <X size={14} />
                    </button>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">This action cannot be undone.</p>
            </div>
            <div className="px-3 pb-4 flex flex-col gap-2">
                <button type="button" onClick={onDeleteForEveryone} className="btn-danger w-full h-10">
                    Delete for everyone
                </button>
                <button type="button" onClick={onDeleteForMe} className="btn-secondary w-full h-10">
                    Delete for me
                </button>
                <button type="button" onClick={onClose} className="w-full py-2 text-xs text-text-muted hover:text-text-secondary transition-colors">
                    Cancel
                </button>
            </div>
        </Modal>
    )
}

function MessageInfoModal({ show, onClose, msg }) {
    return (
        <Modal open={show} onClose={onClose}>
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
                <h3 className="text-md font-semibold text-text-primary tracking-tight">Message Info</h3>
                <button type="button" onClick={onClose} className="btn-icon w-7 h-7" aria-label="Close">
                    <X size={14} />
                </button>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Sent</span>
                    <span className="text-sm text-text-secondary">{msg?.createdAt ? new Date(msg.createdAt).toLocaleString() : '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Status</span>
                    <span className={`text-sm font-medium ${msg?.status === 'seen' ? 'text-success' : 'text-accent-light'}`}>
                        {msg?.status === 'seen' ? '✓✓ Seen' : msg?.status === 'sent' ? '✓ Sent' : msg?.status === 'uploading' ? '⟳ Uploading' : '—'}
                    </span>
                </div>
                {msg?.attachments?.length > 0 && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Attachments</span>
                        <span className="text-sm text-text-secondary">{msg.attachments.length} file{msg.attachments.length > 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>
        </Modal>
    )
}

function MessageInfoModalGroup({ show, onClose, msg, seenBy }) {
    const getInitials = (name = '') =>
        name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    const avatarTones = [
        'bg-accent/15 text-accent-light',
        'bg-success/15 text-success',
        'bg-warning/15 text-warning',
        'bg-danger/15 text-danger',
        'bg-accent/15 text-accent',
        'bg-success/15 text-success',
    ]

    return (
        <Modal open={show} onClose={onClose}>
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
                <h3 className="text-md font-semibold text-text-primary tracking-tight">Message Info</h3>
                <button type="button" onClick={onClose} className="btn-icon w-7 h-7" aria-label="Close">
                    <X size={14} />
                </button>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Sent</span>
                    <span className="text-sm text-text-secondary">
                        {msg?.createdAt ? new Date(msg.createdAt).toLocaleString() : '—'}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Status</span>
                    <span className={`text-sm font-medium ${msg?.status === 'seen' ? 'text-success' : 'text-accent-light'}`}>
                        {msg?.status === 'seen' ? '✓✓ Seen' : msg?.status === 'sent' ? '✓ Sent' : msg?.status === 'uploading' ? '⟳ Uploading' : '—'}
                    </span>
                </div>
                {msg?.attachments?.length > 0 && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Attachments</span>
                        <span className="text-sm text-text-secondary">
                            {msg.attachments.length} file{msg.attachments.length > 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>
            {seenBy.length > 0 && (
                <div className="border-t border-border">
                    <div className="px-5 pt-4 pb-1 flex items-center justify-between">
                        <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Seen by</span>
                        <span className="text-xs text-text-muted font-medium tabular-nums">
                            {seenBy.length} member{seenBy.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="px-5 pb-5 pt-2 flex flex-col gap-0.5">
                        {seenBy.map((member, i) => {
                            const tone = avatarTones[i % avatarTones.length]
                            const seenTime = member.seenAt
                                ? new Date(member.seenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : null
                            const seenDate = member.seenAt ? new Date(member.seenAt) : null
                            const isToday = seenDate ? seenDate.toDateString() === new Date().toDateString() : false
                            const displayTime = seenDate
                                ? isToday ? seenTime : seenDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + seenTime
                                : null
                            return (
                                <div key={member.id || i} className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-surface-hover transition-colors group">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ring-1 ring-border ${tone}`}>
                                        {member.avtar
                                            ? <img src={member.avtar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                            : getInitials(member.name)
                                        }
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-sm text-text-primary font-medium truncate leading-tight">{member.name || 'Unknown'}</span>
                                        {member.role && (
                                            <span className="text-xs text-text-muted truncate leading-tight mt-px">{member.role}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {displayTime && (
                                            <span className="text-xs text-text-muted group-hover:text-text-secondary transition-colors tabular-nums">{displayTime}</span>
                                        )}
                                        <div className="w-4 h-4 rounded-full bg-success/15 flex items-center justify-center text-success">
                                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                                <path d="M1 3.5L3.5 6L8 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
            {seenBy.length === 0 && msg?.status !== 'uploading' && (
                <div className="border-t border-border px-5 py-4">
                    <span className="text-xs text-text-muted uppercase tracking-wider font-semibold block mb-2">Seen by</span>
                    <p className="text-xs text-text-muted italic">Not seen by anyone yet</p>
                </div>
            )}
        </Modal>
    )
}

/* ─────────────────────────────────────────────────────────────
   MAIN Message component
───────────────────────────────────────────────────────────── */
function Message({ msg, key, isGroupChat, onReply = () => { } }) {

    const { user } = userAuthStore()
    const {
        resetNewMessagesCount,
        setCurrentPreviewFile,
        removeMessage,
        setIsReplying,
        setMessageBeingReplied,
        setReaction,
        resetReaction
    } = useChatStore()

    const messageRef = useRef(null)
    const bubbleRef = useRef(null)

    const [showMenu, setShowMenu] = useState(false)
    const [showEmojiBar, setShowEmojiBar] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showInfoModalGroup, setShowInfoModalGroup] = useState(false)
    const [reactions, setReactions] = useState(msg?.reactions || [])
    const [copied, setCopied] = useState(false)

    // ── Suspicious warning state ──────────────────────────────────────
    const [isSuspiciousLink] = useState(false)
    const [isSuspiciousMessage] = useState(false)
    const [warningDismissed, setWarningDismissed] = useState(false)
    const [proceedAnyway, setProceedAnyway] = useState(false)

    const longPressTimer = useRef(null)
    const longPressTriggered = useRef(false)

    const senderId = typeof msg.sender === 'object' ? msg.sender?._id : msg.sender
    const isSent = senderId === user._id
    const senderName = typeof msg.sender === 'object' ? (msg.sender?.username || msg.sender?.name) : ''
    const hasImage = msg?.attachments?.length > 0
    const hasText = msg?.message && msg.message.trim() !== ""
    const hasReply = !!msg?.reply
    const [isLink, setIsLink] = useState(false)

    const [seenBy, setSeenBy] = useState([])

    // Derived: should we show the warning banner?
    const showLinkWarning = isSuspiciousLink && !warningDismissed && !proceedAnyway && isLink
    const showMessageWarning = isSuspiciousMessage && !warningDismissed && !proceedAnyway && !isLink

    /* ── Sync reactions from updated message ── */
    useEffect(() => {
        setReactions(msg?.reactions || [])
    }, [msg?.reactions])

    const getSeenMembers = async () => {
        const res = await messageApi.getSeenMembers(msg._id)
        if (res.success) {
            setSeenBy(res.data)
        }
    }

    useEffect(() => {
        if (showInfoModalGroup) getSeenMembers()
    }, [showInfoModalGroup])

    /* ── Intersection observer (seen) ── */
    useEffect(() => {
        if (senderId === user._id) return
        if (msg.status === "seen") return
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (isGroupChat) {
                            socket.emit(socketEvents.MESSAGE_SEEN_GROUP_CHAT, { messageId: msg._id, chatId: msg.chatId })
                        } else {
                            socket.emit(socketEvents.MESSAGE_SEEN_SINGLE_CHAT, { messageId: msg._id, chatId: msg.chatId })
                        }
                        resetNewMessagesCount(msg.chatId)
                        observer.disconnect()
                    }
                })
            },
            { threshold: 0.6 }
        )
        if (messageRef.current) observer.observe(messageRef.current)
        return () => observer.disconnect()
    }, [msg._id])

    useEffect(() => {
        if (showMenu) setShowEmojiBar(false)
    }, [showMenu])

    useEffect(() => {
        let is = isThisLink(msg.message)
        setIsLink(is)
    }, [])

    const handleTouchStart = useCallback(() => {
        longPressTriggered.current = false
        longPressTimer.current = setTimeout(() => {
            longPressTriggered.current = true
            setShowMenu(true)
        }, 500)
    }, [])

    const handleTouchEnd = useCallback(() => { clearTimeout(longPressTimer.current) }, [])
    const handleTouchMove = useCallback(() => { clearTimeout(longPressTimer.current) }, [])

    const handleAction = (actionId) => {
        switch (actionId) {
            case 'reply':
                if (onReply) onReply(msg)
                setIsReplying(true)
                setMessageBeingReplied(msg)
                break
            case 'copy':
                if (msg.message) {
                    navigator.clipboard.writeText(msg.message).then(() => {
                        setCopied(true)
                        setTimeout(() => setCopied(false), 1800)
                    })
                }
                break
            case 'forward':
                socket.emit(socketEvents.FORWARD_MESSAGE || 'forward_message', { messageId: msg._id })
                break
            case 'info':
                if (isGroupChat) setShowInfoModalGroup(true)
                else setShowInfoModal(true)
                break
            case 'delete':
                setShowDeleteModal(true)
                break
            default:
                break
        }
    }

    const handleDeleteForMe = async () => {
        const res = await messageApi.deleteForMe(msg._id)
        if (res.success) {
            removeMessage(msg.chatId, msg._id)
        }
        setShowDeleteModal(false)
    }

    const handleDeleteForEveryone = async () => {
        const res = await messageApi.deleteForEveryone(msg._id)
        if (res.success) {
            removeMessage(msg.chatId, msg._id)
        }
        setShowDeleteModal(false)
    }

    const handleEmojiPick = (emoji) => {
        setReaction(msg._id, emoji)
        setReactions(prev => {
            const existing = prev.find(r => r.userId === user._id && r.emoji === emoji)
            if (existing) return prev.filter(r => !(r.userId === user._id && r.emoji === emoji))
            return [...prev.filter(r => r.userId !== user._id), { userId: user._id, emoji }]
        })
        setShowEmojiBar(false)
        socket.emit(socketEvents.REACT_MESSAGE_SINGLE_CHAT, {
            messageId: msg._id,
            chatId: msg.chatId,
            emoji,
            to: senderId === user._id ? "receiver" : "sender"
        })
        resetReaction()
    }

    const hoverTimer = useRef(null)
    const handleMouseEnter = () => { hoverTimer.current = setTimeout(() => setShowEmojiBar(true), 400) }
    const handleMouseLeave = () => { clearTimeout(hoverTimer.current); setShowEmojiBar(false) }

    // Handle indicator messages
    if (msg?.isIndicator) {
        return (
            <div className="flex justify-center my-3">
                <div className="text-xs text-text-muted bg-surface-700 border border-border px-3.5 py-1 rounded-full">
                    {msg.message}
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Suspicious warning banner */}
            {(showLinkWarning || showMessageWarning) && (
                <SuspiciousWarning
                    type={showLinkWarning ? 'link' : 'message'}
                    isSent={isSent}
                    onDismiss={() => setWarningDismissed(true)}
                    onProceed={() => setProceedAnyway(true)}
                />
            )}

            {/* Bubble Row */}
            <div
                ref={messageRef}
                key={key}
                className={[
                    'flex mb-2 px-1 group select-none',
                    isSent ? 'justify-end' : 'justify-start',
                ].join(' ')}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Action btn — left (received) */}
                {!isSent && (
                    <div className="flex items-center mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-end pb-1">
                        <button
                            onClick={() => setShowMenu(v => !v)}
                            className="btn-icon w-6 h-6"
                        >
                            <MoreHorizontal size={13} />
                        </button>
                    </div>
                )}

                {/* Bubble column */}
                <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    {isGroupChat && !isSent && senderName && (
                        <span className="text-xs font-semibold mb-1 ml-1 text-accent-light leading-none">
                            {senderName}
                        </span>
                    )}
                    <div className="relative">
                        <EmojiBar show={showEmojiBar} isSent={isSent} onPick={handleEmojiPick} />

                        {/* Bubble Container */}
                        <div
                            ref={bubbleRef}
                            className={[
                                'relative min-w-[72px] rounded-lg overflow-hidden break-words whitespace-pre-wrap transition-all duration-150',
                                isSent
                                    ? 'bg-accent text-white rounded-br-none shadow-panel'
                                    : 'bg-surface-700 text-text-primary rounded-bl-none border border-border shadow-subtle',
                                msg.status === 'uploading' ? 'opacity-65' : '',
                                (isSuspiciousLink || isSuspiciousMessage) && !proceedAnyway && !warningDismissed
                                    ? 'blur-[1.5px] pointer-events-none select-none'
                                    : '',
                            ].join(' ')}
                        >
                            {/* Reply Quote */}
                            {hasReply && (
                                <ReplyQuote reply={msg.reply} isSent={isSent} />
                            )}

                            {/* Attachment image */}
                            {hasImage && (
                                <div
                                    onClick={() => {
                                        if (!longPressTriggered.current) {
                                            setCurrentPreviewFile(msg.attachments[0]?.secure_url || msg.attachments[0]?.preview)
                                        }
                                    }}
                                    className="relative w-full min-w-[180px] max-w-[320px] cursor-pointer"
                                >
                                    <img
                                        className="block w-full object-cover rounded-[inherit]"
                                        src={msg.attachments[0]?.preview || msg.attachments[0]?.secure_url}
                                        alt=""
                                        draggable={false}
                                    />
                                    {msg.status === "uploading" && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[inherit]">
                                            <div className="w-7 h-7 rounded-full border-2 border-white/20 border-t-accent loading-spinner" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Message text */}
                            {hasText && (isLink ?
                                <div className={`text-sm leading-relaxed px-3.5 pt-2.5 ${!hasImage ? 'pb-[24px]' : 'pb-5'} text-accent-light hover:underline`}>
                                    <a href={msg.message} target='_blank' rel="noreferrer">{msg.message}</a>
                                </div> :
                                <div className={`text-sm leading-relaxed px-3.5 pt-2.5 ${!hasImage ? 'pb-[24px]' : 'pb-5'}`}>
                                    {msg.message}
                                </div>
                            )}

                            {/* Metadata / Timestamp */}
                            <div className={[
                                'absolute bottom-[5px] right-[10px] flex items-center gap-[3px]',
                                hasImage && !hasText ? 'bg-black/40 rounded-full px-2 py-0.5' : ''
                            ].join(' ')}>
                                {msg?.createdAt && (
                                    <span className="text-[10px] opacity-75 tracking-tight" style={{ color: 'inherit' }}>
                                        {getTime(msg.createdAt)}
                                    </span>
                                )}
                                {isSent && (
                                    <>
                                        {msg.status === "sent" && <CheckIcon size={12} className="text-white/70" />}
                                        {msg.status === "seen" && <CheckCheck size={12} className="text-sky-200" />}
                                    </>
                                )}
                            </div>
                        </div>

                        <ReactionChips reactions={reactions} isSent={isSent} msg={msg} />
                    </div>
                </div>

                {/* Action btn — right (sent) */}
                {isSent && (
                    <div className="flex items-center ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-end pb-1">
                        <button
                            onClick={() => setShowMenu(v => !v)}
                            className="btn-icon w-6 h-6"
                        >
                            <MoreHorizontal size={13} />
                        </button>
                    </div>
                )}
            </div>

            {/* Copied toast */}
            {copied && (
                <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[999] px-4 py-2 rounded-full text-xs font-medium text-text-primary bg-surface-900 border border-border shadow-panel animate-fade-in">
                    Copied to clipboard
                </div>
            )}

            <MessageContextMenu
                open={showMenu}
                isSent={isSent}
                onAction={handleAction}
                onClose={() => setShowMenu(false)}
                anchorRef={bubbleRef}
            />

            <DeleteModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDeleteForMe={handleDeleteForMe}
                onDeleteForEveryone={handleDeleteForEveryone}
            />

            <MessageInfoModal
                show={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                msg={msg}
            />

            <MessageInfoModalGroup
                show={showInfoModalGroup}
                onClose={() => setShowInfoModalGroup(false)}
                msg={msg}
                seenBy={seenBy}
            />
        </>
    )
}

export default Message