import React from 'react'

/**
 * Shared input primitive with optional leading icon.
 */
function Input({ leading = null, className = '', type = 'text', ...props }) {
  return (
    <div className="relative w-full">
      {leading && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none flex items-center">
          {leading}
        </span>
      )}
      <input
        type={type}
        className={[
          'input-field',
          leading ? 'pl-9' : '',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  )
}

export default Input
