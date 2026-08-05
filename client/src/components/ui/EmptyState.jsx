import React from 'react'

/**
 * Shared empty state: icon tile + title + optional description.
 */
function EmptyState({ icon: Icon = null, title, description = '', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-center px-6 ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-md bg-surface-700 flex items-center justify-center text-text-muted">
          <Icon size={22} strokeWidth={1.75} />
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-text-primary tracking-tight">{title}</p>
        {description && (
          <p className="text-sm text-text-muted mt-1 max-w-[260px] leading-relaxed mx-auto">{description}</p>
        )}
      </div>
    </div>
  )
}

export default EmptyState
