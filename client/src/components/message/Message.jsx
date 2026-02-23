import React, { useEffect } from 'react'
import { useContext } from 'react'
import { authContext } from '../../context/AuthProvider'
import { getTime } from '../../services/getTime'
import {
    CheckIcon,
    CheckCheck,
} from 'lucide-react'
import { userAuthStore } from '../../store/userStore'
import { socket } from '../../socket/socket'
import { socketEvents } from '../../constants/socketEvents'
import { useChatStore } from '../../store/useChatStore'

function Message({ msg, key }) {

    const context = useContext(authContext)
    const { user } = userAuthStore()
    const { resetNewMessagesCount } = useChatStore()

    const messageRef = React.useRef(null)

    useEffect(() => {
        if (msg.sender === user._id) return
        if (msg.status === "seen") return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        console.log("Message " + msg?.message + " is On viewport...")
                        socket.emit(socketEvents.MESSAGE_SEEN_SINGLE_CHAT, {
                            messageId: msg._id,
                            chatId: msg.chatId
                        })
                        resetNewMessagesCount(msg.chatId)
                        observer.disconnect()
                    }
                })
            },
            { threshold: 0.6 }
        )

        if (messageRef.current) {
            observer.observe(messageRef.current)
        }

        return () => observer.disconnect()
    }, [msg._id])

    const isSent = msg.sender === user._id
    const hasImage = msg?.attachments?.length > 0
    const hasText = msg?.message && msg.message.trim() !== ""

    return (
        <>
            <style>{`
                @keyframes msgIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .msg-anim { animation: msgIn 0.2s ease; }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .img-spin {
                    animation: spin 0.75s linear infinite;
                    border-top-color: #818cf8;
                }

                .msg-time { font-family: 'JetBrains Mono', monospace; }

                .only-image-meta {
                    background: rgba(0,0,0,0.45);
                    backdrop-filter: blur(6px);
                    border-radius: 20px;
                    padding: 2px 7px;
                }
            `}</style>

            {/* Row */}
            <div
                ref={messageRef}
                key={key}
                className={`msg-anim flex mb-1.5 px-1 ${isSent ? 'justify-end' : 'justify-start'}`}
            >
                {/* Bubble */}
                <div
                    className={[
                        'relative max-w-[65%] min-w-[72px] rounded-[18px] overflow-hidden break-words whitespace-pre-wrap',
                        'shadow-[0_2px_12px_rgba(0,0,0,0.35)]',
                        isSent
                            ? 'text-white rounded-br-[5px]'
                            : 'bg-[#1e2133] text-[#e2e4f0] rounded-bl-[5px] border border-white/[0.06]',
                        msg.status === 'uploading' ? 'opacity-75' : '',
                    ].join(' ')}
                    style={isSent ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}
                >
                    {/* Image */}
                    {hasImage && (
                        <div className="relative w-full min-w-[180px] max-w-[320px]">
                            <img
                                className="block w-full object-cover rounded-[inherit]"
                                src={msg.attachments[0]?.preview || msg.attachments[0]?.secure_url}
                                alt=""
                            />
                            {msg.status === "uploading" && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[4px] rounded-[inherit]">
                                    <div className="img-spin w-8 h-8 rounded-full border-[3px] border-white/15" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Text */}
                    {hasText && (
                        <div
                            className={`text-[13.5px] leading-[1.55] px-3.5 pt-2.5 ${!hasImage ? 'pb-[26px]' : 'pb-6'}`}
                            style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                            {msg.message}
                        </div>
                    )}

                    {/* Meta: time + ticks */}
                    <div className={`absolute bottom-[5px] right-[10px] flex items-center gap-[3px] ${hasImage && !hasText ? 'only-image-meta' : ''}`}>
                        {msg?.createdAt && (
                            <span className="msg-time text-[10.5px] opacity-65 tracking-[-0.3px]" style={{ color: 'inherit' }}>
                                {getTime(msg.createdAt)}
                            </span>
                        )}
                        {isSent && (
                            <>
                                {msg.status === "sent" && (
                                    <CheckIcon size={13} className="text-white/50" />
                                )}
                                {msg.status === "seen" && (
                                    <CheckCheck size={13} className="text-[#a5f3fc]" />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Message