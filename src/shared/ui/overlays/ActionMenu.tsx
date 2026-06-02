// src/shared/ui/overlays/ActionMenu.tsx
import { Fragment } from 'react'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export interface ActionMenuItem {
  label: string
  icon?: LucideIcon
  onClick: () => void
  disabled?: boolean
  destructive?: boolean
  separator?: boolean
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  triggerLabel?: string
}

export function ActionMenu({ items, triggerLabel = 'Acciones' }: ActionMenuProps) {
  return (
    <DropdownMenu>
      {/*
        ✅ Base UI MenuPrimitive.Trigger NO tiene asChild.
        render prop compone con nuestro button sin anidar <button><button>.
      */}
      <DropdownMenuTrigger
        aria-label={triggerLabel}
        render={
          <button
            type="button"
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-lg border border-transparent",
              "hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          />
        }
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {/* ✅ Fragment con key explícito — evita React warning de key en Fragment */}
        {items.map((item, idx) => (
          <Fragment key={item.label}>
            {item.separator && idx > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={item.onClick}
              disabled={item.disabled}
              variant={item.destructive ? 'destructive' : 'default'}
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.label}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}