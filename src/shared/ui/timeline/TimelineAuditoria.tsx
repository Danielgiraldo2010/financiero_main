import { formatDate } from '@/shared/lib/date'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge'
import { cn } from '@/shared/lib/cn'

export interface TimelineItem {
  estado: string
  fecha: string
  usuario: string
  observacion?: string
}

interface TimelineAuditoriaProps {
  items: TimelineItem[]
  isLoading?: boolean
}

export function TimelineAuditoria({ items, isLoading = false }: TimelineAuditoriaProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        Sin historial de auditoría
      </p>
    )
  }

  return (
    <ol className="relative border-l border-muted">
      {items.map((item, index) => (
        <li key={index} className={cn('ml-4 pb-6', index === items.length - 1 && 'pb-0')}>
          <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-background bg-primary" />
          <div className="flex flex-wrap items-center gap-2">
            {/* ✅ prop correcta es "label", no "value" */}
            <StatusBadge label={item.estado} />
            <time className="text-xs text-muted-foreground">{formatDate(item.fecha)}</time>
            <span className="text-xs text-muted-foreground">· {item.usuario}</span>
          </div>
          {item.observacion && (
            <p className="mt-1 text-sm text-muted-foreground">{item.observacion}</p>
          )}
        </li>
      ))}
    </ol>
  )
}