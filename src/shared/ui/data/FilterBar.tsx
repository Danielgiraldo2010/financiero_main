import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface FilterBarProps {
  children: ReactNode
  onReset: () => void
}

export function FilterBar({ children, onReset }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-[16px] border border-[#dbe3ed] bg-[#f8fbfe] p-3.5 shadow-sm">
      {children}
      <Button variant="ghost" size="sm" onClick={onReset} className="gap-1 text-[#5a6c82] hover:text-[#19324d]">
        <X className="h-4 w-4" />
        Limpiar
      </Button>
    </div>
  )
}
