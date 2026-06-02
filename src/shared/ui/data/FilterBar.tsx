import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface FilterBarProps {
  children: ReactNode
  onReset: () => void
}

export function FilterBar({ children, onReset }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/30 p-3">
      {children}
      <Button variant="ghost" size="sm" onClick={onReset} className="gap-1 text-muted-foreground">
        <X className="h-4 w-4" />
        Limpiar
      </Button>
    </div>
  )
}
