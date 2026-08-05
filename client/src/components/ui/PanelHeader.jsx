import React from 'react'
import { X, ChevronLeft } from 'lucide-react'
import Button from './Button.jsx'

/**
 * Shared sidebar panel header with optional back button, title, subtitle,
 * trailing action and close button. Renders the divider underneath.
 */
function PanelHeader({ title, subtitle = '', onBack = null, onClose = null, action = null }) {
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <Button
              variant="ghost"
              size="iconSm"
              onClick={onBack}
              aria-label="Go back"
              className="flex-shrink-0"
            >
              <ChevronLeft size={16} />
            </Button>
          )}
          <div className="min-w-0">
            <h2 className="text-md font-semibold text-text-primary tracking-tight truncate leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-text-muted truncate leading-tight mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {action}
          {onClose && (
            <Button variant="ghost" size="iconSm" onClick={onClose} aria-label="Close panel">
              <X size={16} />
            </Button>
          )}
        </div>
      </div>
      <div className="h-px bg-border mx-4" />
    </>
  )
}

export default PanelHeader
