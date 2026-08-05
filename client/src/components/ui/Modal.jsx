import React, { useEffect } from 'react'

/**
 * Shared modal: backdrop + centered (bottom sheet on mobile) panel.
 * Closes on backdrop click and Escape. Renders nothing when closed.
 */
function Modal({ open = false, onClose = () => { }, children, className = '' }) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/60 px-4 pb-6 sm:pb-0 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-sm rounded-lg bg-surface-900 border border-border shadow-overlay overflow-hidden animate-slide-up ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
