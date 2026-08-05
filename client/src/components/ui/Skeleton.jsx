import React from 'react'

/**
 * Shared skeleton block.
 */
function Skeleton({ className = '' }) {
  return <div className={`skeleton-pulse rounded-sm bg-surface-700 ${className}`} />
}

export default Skeleton
