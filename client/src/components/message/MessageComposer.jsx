import React from 'react'
import { Send, X, Reply, ImageIcon } from 'lucide-react'
import { Button } from '../ui/index.js'
import FileUpload from './FileUpload.jsx'

/**
 * Message composer: attach + input + reply strip + send.
 * Pure presentation — all actions are passed in as props.
 */
function MessageComposer({
  message = "",
  onMessageChange = () => {},
  onSend = () => {},
  canSend = false,
  isReplying = false,
  messageBeingReplied = null,
  onCancelReply = () => {},
  currentChatUser = null,
  userId = null,
  inputRef = null,
}) {
  const replyIsOwn = messageBeingReplied?.sender === userId
  const replyHasAttachment = messageBeingReplied?.attachments?.length > 0
  const replyHasText = messageBeingReplied?.message?.trim()
  const replyThumbUrl = replyHasAttachment
    ? (messageBeingReplied.attachments[0]?.secure_url || messageBeingReplied.attachments[0]?.preview)
    : null
  const replyPreviewText = replyHasText
    ? messageBeingReplied.message
    : replyHasAttachment ? 'Photo' : ''

  return (
    <footer
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
      className="flex-shrink-0 z-20 flex flex-col border-t border-border bg-surface-800"
    >
      {isReplying && messageBeingReplied && (
        <div className="flex items-center gap-2.5 px-4 py-2 border-b border-border bg-surface-900/80 animate-fade-in">
          <div className="flex items-center gap-2.5 flex-1 min-w-0 rounded-sm px-3 py-1.5 bg-accent/15 border-l-2 border-accent">
            <Reply size={12} className="text-accent-light flex-shrink-0" style={{ transform: 'scaleX(-1)' }} />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[11px] font-bold leading-none mb-0.5 text-accent-light">
                {replyIsOwn ? 'You' : (currentChatUser?.username || 'Them')}
              </span>
              <span className="text-xs truncate leading-snug text-text-muted">
                {replyHasAttachment && (
                  <span className="inline-flex items-center gap-1 mr-1">
                    <ImageIcon size={10} className="inline text-accent-light" />
                    {!replyHasText && 'Photo'}
                  </span>
                )}
                {replyHasText && replyPreviewText}
              </span>
            </div>
            {replyThumbUrl && (
              <img
                src={replyThumbUrl}
                alt=""
                className="w-8 h-8 rounded-sm object-cover flex-shrink-0 ring-1 ring-border"
              />
            )}
          </div>
          <Button variant="ghost" size="iconSm" onClick={onCancelReply} aria-label="Cancel reply" className="flex-shrink-0">
            <X size={12} />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-3 h-16 px-3 md:px-5">
        <div className="flex flex-1 items-center gap-1 md:gap-2 bg-surface-700 border border-border rounded-sm px-1 pr-1.5 transition-colors duration-150 focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/15">
          <div className="flex items-center px-1 text-text-muted flex-shrink-0">
            <FileUpload />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={onMessageChange}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && isReplying) {
                onCancelReply()
                return
              }
              e.key === 'Enter' && !e.shiftKey && onSend(e)
            }}
            placeholder={
              isReplying
                ? `Reply to ${replyIsOwn ? 'yourself' : currentChatUser?.username}…`
                : "Type a message…"
            }
            aria-label="Message input"
            className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm py-3 px-1.5 md:px-2 placeholder:text-text-muted"
            style={{ minHeight: '40px' }}
          />
        </div>
        <Button
          variant="primary"
          size="icon"
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send message"
          className="w-10 h-10 p-0 flex-shrink-0"
        >
          <Send size={17} />
        </Button>
      </div>
    </footer>
  )
}

export default MessageComposer
