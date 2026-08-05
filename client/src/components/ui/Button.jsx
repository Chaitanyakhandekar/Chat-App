import React from 'react'

const VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-surface-700 text-text-primary border border-border hover:bg-surface-hover',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-hover',
  danger: 'bg-danger/10 text-danger border border-danger/25 hover:bg-danger/20 hover:border-danger/40',
}

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-4 text-sm gap-2',
  icon: 'w-9 h-9',
  iconSm: 'w-7 h-7',
}

/**
 * Shared button primitive.
 * Defaults to `type="button"` — pass `type="submit"` inside forms.
 */
function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={[
        'inline-flex items-center justify-center rounded-sm font-medium',
        'transition-colors duration-150',
        'active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        'disabled:opacity-40 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
