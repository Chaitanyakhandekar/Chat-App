import React from 'react'

/**
 * Shared switch toggle with proper `role="switch"` semantics.
 */
function Toggle({ on = false, onChange = () => { }, label = 'Toggle', className = '' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={[
        'relative w-9 h-5 rounded-full flex-shrink-0',
        'transition-colors duration-150',
        on ? 'bg-accent' : 'bg-surface-700',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        className,
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white',
          'transition-transform duration-150',
          on ? 'translate-x-4' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}

export default Toggle
