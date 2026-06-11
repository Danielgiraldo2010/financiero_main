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
    <div className="flex flex-col gap-3 border-l-4 border-[#d5bb87] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-[-0.025em] text-[#004b82] sm:text-2xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm font-medium leading-5 text-muted-foreground">{description}</p>
        )}
      </div>
      {slot && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:w-auto">{slot}</div>
      )}
    </div>
  )
}
