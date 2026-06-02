import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  /** Slot de acciones (botones, menus, etc.) */
  actions?: ReactNode
  /** Alias de compatibilidad — fe_01b uso "action" (singular) */
  action?: ReactNode
}

export function PageHeader({ title, description, actions, action }: PageHeaderProps) {
  const slot = actions ?? action
  return (
    <div className="flex items-start justify-between gap-4 pb-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {slot && (
        <div className="flex shrink-0 items-center gap-2">{slot}</div>
      )}
    </div>
  )
}
