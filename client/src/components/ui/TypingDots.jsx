import React from 'react'

/**
 * Animated typing dots. Inherits current text color via `bg-current`.
 */
function TypingDots({ className = '' }) {
  return (
    <span className={`inline-flex gap-0.5 items-center ${className}`}>
      <span className="typing-dot w-[3px] h-[3px] rounded-full bg-current inline-block" />
      <span className="typing-dot w-[3px] h-[3px] rounded-full bg-current inline-block" />
      <span className="typing-dot w-[3px] h-[3px] rounded-full bg-current inline-block" />
    </span>
  )
}

export default TypingDots
