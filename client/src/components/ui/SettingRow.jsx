import React from 'react'
import { ChevronRight } from 'lucide-react'

/**
 * Shared settings/list row: icon tile + label (+ sublabel) + optional trailing content.
 * Renders as a button when `onClick` is provided.
 */
function SettingRow({
  icon: Icon = null,
  label,
  sublabel = '',
  right = null,
  onClick = null,
  danger = false,
  showChevron = false,
  className = '',
}) {
  const content = (
    <>
      {Icon && (
        <div
          className={[
            'w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0',
            danger ? 'bg-danger/10 text-danger' : 'bg-accent-subtle text-accent-light',
          ].join(' ')}
        >
          <Icon size={14} />
        </div>
      )}
      <div className="flex flex-col min-w-0 flex-1 text-left">
        <span className={`text-sm truncate ${danger ? 'text-danger' : 'text-text-primary'}`}>{label}</span>
        {sublabel && <span className={`text-xs truncate leading-tight mt-px ${danger ? 'text-danger/70' : 'text-text-muted'}`}>{sublabel}</span>}
      </div>
      {showChevron && <ChevronRight size={14} className="text-text-muted flex-shrink-0" />}
      {!showChevron && right && <div className="flex-shrink-0">{right}</div>}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={[
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
          danger ? 'hover:bg-danger/10' : 'hover:bg-surface-hover',
          className,
        ].join(' ')}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={`w-full flex items-center gap-3 px-3 py-2.5 ${danger ? 'hover:bg-danger/10' : 'hover:bg-surface-hover'} transition-colors duration-150 ${className}`}>
      {content}
    </div>
  )
}

export default SettingRow
