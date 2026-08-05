import React from 'react'

const VARIANTS = {
  accent: 'bg-accent/15 text-accent-light',
  primary: 'bg-accent text-white',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  neutral: 'bg-surface-700 text-text-secondary',
}

const SIZES = {
  sm: 'text-[9px] px-1.5 py-0.5',
  md: 'text-[10px] px-2 py-0.5',
}

/**
 * Shared pill badge for counts, statuses and labels.
 */
function Badge({ children, variant = 'accent', size = 'md', className = '', ...props }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full font-semibold leading-none whitespace-nowrap',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
