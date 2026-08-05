import React, { useState } from 'react'

const SIZES = {
  xs: 'w-6 h-6 text-[9px]',
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-20 h-20 text-xl',
}

const DOT_SIZES = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-2.5 h-2.5',
  xl: 'w-3.5 h-3.5',
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'
}

/**
 * Shared avatar with image fallback to initials.
 * `online` renders a success status dot.
 */
function Avatar({ src, name = '', size = 'md', online = false, className = '', alt = '' }) {
  const [broken, setBroken] = useState(false)
  const showImage = !!src && !broken

  return (
    <div className={`relative flex-shrink-0 ${SIZES[size]} ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={alt || name || ''}
          onError={() => setBroken(true)}
          className="w-full h-full rounded-full object-cover ring-1 ring-border block"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-surface-700 text-text-secondary flex items-center justify-center font-semibold ring-1 ring-border select-none">
          {getInitials(name)}
        </div>
      )}
      {online && (
        <span className={`absolute bottom-0 right-0 rounded-full bg-success ring-2 ring-surface-800 ${DOT_SIZES[size]}`} />
      )}
    </div>
  )
}

export default Avatar
