import React from 'react'
import { cn } from '../../lib/utils'

interface GlassButtonProps {
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
  icon?: React.ReactNode
  'aria-label'?: string
  title?: string
  'data-testid'?: string
}

/**
 * Shell button. Sans type, medium radius, hairline border. Case follows the
 * label copy (sentence case) rather than forced uppercase — the old terminal
 * uppercase style survives only inside the conversation core.
 */
const variantMap: Record<NonNullable<GlassButtonProps['variant']>, string> = {
  primary:
    'bg-primary text-primary-foreground border-primary font-medium hover:bg-primary/85 hover:border-primary/85 focus-visible:outline-[color:var(--foreground)]',
  secondary:
    'bg-transparent text-foreground border-border hover:bg-foreground/[0.06] hover:border-foreground/40',
  ghost:
    'bg-transparent text-foreground/80 border-transparent hover:bg-foreground/[0.05] hover:text-foreground',
  destructive:
    'bg-transparent text-[var(--state-error)] border-[color:color-mix(in_srgb,var(--state-error)_45%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--state-error)_12%,transparent)]'
}

const sizeMap: Record<NonNullable<GlassButtonProps['size']>, string> = {
  sm: 'px-2.5 py-1 text-[12px] gap-1.5 rounded-md min-h-[28px]',
  md: 'px-3.5 py-1.5 text-[13px] gap-2 rounded-md min-h-[34px]',
  lg: 'px-4 py-2 text-[14px] gap-2 rounded-md min-h-[40px]'
}

export function GlassButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  type = 'button',
  icon,
  'aria-label': ariaLabel,
  title,
  'data-testid': dataTestId
}: GlassButtonProps): React.ReactNode {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      data-testid={dataTestId}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center border transition-colors duration-150 select-none',
        variantMap[variant],
        sizeMap[size],
        disabled && 'pointer-events-none cursor-not-allowed opacity-40',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  )
}
