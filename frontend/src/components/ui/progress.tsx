import * as React from 'react'
import { cn } from '@/lib/utils'

type ProgressProps = {
  value?: number // 0-100
  label?: string
  className?: string
  color?: 'primary' | 'yellow'
}

export function Progress({ value = 0, label, className, color = 'primary' }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('w-full space-y-1', className)}>
      {label ? <div className="text-xs text-gray-400">{label}</div> : null}
      <div className="h-2 w-full overflow-hidden rounded bg-muted">
        <div
          className={cn(
            'h-full transition-[width] duration-150 ease-linear',
            color === 'primary' ? 'bg-primary' : 'bg-yellow-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}


