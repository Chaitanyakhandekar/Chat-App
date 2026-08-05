import React, { useEffect, useRef } from 'react'

/**
 * Shared dropdown menu container. Closes on outside click.
 * Position with `className` (e.g. `absolute right-0 top-full mt-1`).
 */
function Menu({ open = false, onClose = () => { }, children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={ref}
      role="menu"
      className={[
        'min-w-[180px] py-1 rounded-md bg-surface-900 border border-border shadow-panel',
        'animate-scale-in z-50',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

function MenuItem({ icon: Icon = null, children, danger = false, onClick = () => { }, className = '' }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={[
        'w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-left',
        'transition-colors duration-100',
        'focus-visible:outline-none focus-visible:bg-surface-hover',
        danger
          ? 'text-danger hover:bg-danger/10'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
        className,
      ].join(' ')}
    >
      {Icon && <Icon size={15} strokeWidth={2} className="flex-shrink-0" />}
      {children}
    </button>
  )
}

function MenuSeparator({ className = '' }) {
  return <div className={`h-px bg-border my-1 ${className}`} />
}

export { Menu, MenuItem, MenuSeparator }
export default Menu
