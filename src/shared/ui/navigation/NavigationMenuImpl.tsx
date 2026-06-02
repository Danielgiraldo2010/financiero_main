import { Link, useRouterState } from '@tanstack/react-router'
import { cn } from '@/shared/lib/cn'
import type { LucideIcon } from 'lucide-react'
import { usePermissions } from '@/shared/hooks/usePermissions'

export interface NavItem {
  label: string
  icon: LucideIcon
  to: string
  roles?: string[]
  /**
   * Si true, el item se marca activo solo cuando el pathname coincide
   * exactamente con `to`. Por defecto usa startsWith para marcar activas
   * las subrutas del mismo módulo.
   */
  exact?: boolean
}

interface NavigationMenuProps {
  items: NavItem[]
}

export function NavigationMenu({ items }: NavigationMenuProps) {
  const { hasRole } = usePermissions()
  const { location } = useRouterState()

  const visibleItems = items.filter(
    (item) => !item.roles || hasRole(item.roles),
  )

  return (
    <nav>
      <ul className="flex flex-col gap-0.5">
        {visibleItems.map((item) => {
          // exact=true → igualdad estricta
          // exact=false (default) → startsWith, pero solo si ningún otro
          // item más específico también empieza por el mismo prefijo
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to) &&
              // Evita que /catalogos/unidades-ejecutoras active también
              // items cuyo `to` es un prefijo de otro item ya activo
              !visibleItems.some(
                (other) =>
                  other !== item &&
                  location.pathname.startsWith(other.to) &&
                  other.to.startsWith(item.to) &&
                  other.to.length > item.to.length,
              )

          const Icon = item.icon
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
