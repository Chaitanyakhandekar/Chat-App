import React from 'react'

/**
 * Shared uppercase section label.
 */
function SectionLabel({ children, className = '', danger = false }) {
  return (
    <p
      className={[
        'text-[10px] font-semibold uppercase tracking-wider',
        danger ? 'text-danger' : 'text-text-muted',
        className,
      ].join(' ')}
    >
      {children}
    </p>
  )
}

export default SectionLabel
