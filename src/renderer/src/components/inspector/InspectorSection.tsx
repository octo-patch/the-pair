import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

interface InspectorSectionProps {
  id: string
  label: string
  badge?: React.ReactNode
  defaultOpen?: boolean
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/**
 * Collapsible inspector section. Headers are always visible so the section
 * list scans as a table of contents; bodies collapse to save vertical space.
 * State is uncontrolled per panel mount (the panel is keyed by pair id).
 */
export function InspectorSection({
  id,
  label,
  badge,
  defaultOpen = true,
  actions,
  children,
  className
}: InspectorSectionProps): React.ReactNode {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section data-testid={`inspector-section-${id}`} className={cn('space-y-1', className)}>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={`inspector-body-${id}`}
          data-testid={`inspector-toggle-${id}`}
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-sm px-1 py-0.5 text-left transition-colors hover:bg-foreground/[0.04] cursor-pointer"
        >
          <ChevronRight
            size={11}
            aria-hidden
            className={cn(
              'shrink-0 text-muted-foreground-faint transition-transform duration-150',
              open && 'rotate-90'
            )}
          />
          <span className="min-w-0 flex-1 truncate text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </span>
          {badge}
        </button>
        {actions}
      </div>
      {open && (
        <div id={`inspector-body-${id}`} className="space-y-1.5">
          {children}
        </div>
      )}
    </section>
  )
}
