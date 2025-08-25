import { cn } from '@/lib/utils'

type MessageProps = {
  kind: 'success' | 'error' | 'info' | 'warning'
  children: React.ReactNode
}

export function Message({ kind, children }: MessageProps) {
  const base = 'rounded-md border px-3 py-2 text-sm'
  const styles = {
    success: 'border-green-700 bg-green-900/30 text-green-200',
    error: 'border-red-700 bg-red-900/30 text-red-200',
    info: 'border-blue-700 bg-blue-900/30 text-blue-200',
    warning: 'border-yellow-600 bg-yellow-900/30 text-yellow-200',
  } as const
  return <div className={cn(base, styles[kind])}>{children}</div>
}


