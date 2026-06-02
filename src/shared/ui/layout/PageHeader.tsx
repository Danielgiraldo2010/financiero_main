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
    <div className="flex items-start justify-between gap-4 border-l-4 border-[#d5bb87] bg-[linear-gradient(90deg,rgba(213,187,135,0.12),rgba(255,255,255,0))] py-1 pl-4 pr-1">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#004b82]">{title}</h1>
        {description && (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        )}
      </div>
      {slot && (
        <div className="flex shrink-0 items-center gap-2">{slot}</div>
      )}
    </div>
  )
}
