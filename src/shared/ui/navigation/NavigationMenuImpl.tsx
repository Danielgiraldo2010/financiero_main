import { Link, useRouterState } from '@tanstack/react-router'
import { cn } from '@/shared/lib/cn'
import type { LucideIcon } from 'lucide-react'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { useUIStore } from '@/shared/state/ui.store'

export interface NavItem {
  label: string
  icon: LucideIcon
  to: string
  roles?: string[]
  exact?: boolean
}

interface NavigationMenuProps {
  items: NavItem[]
}

export function NavigationMenu({ items }: NavigationMenuProps) {
  const { hasRole } = usePermissions()
  const { location } = useRouterState()
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)

  const visibleItems = items.filter(
    (item) => !item.roles || hasRole(item.roles),
  )

  const handleNavClick = () => {
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  return (
    <nav>
      <ul className="flex flex-col gap-1">
        {visibleItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to) &&
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
                onClick={handleNavClick}
                className={cn(
                  'group flex items-center gap-3 rounded-[14px] border-l-4 border-transparent px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out',
                  isActive
                    ? 'border-[#d5bb87] bg-[linear-gradient(90deg,rgba(0,75,130,0.28)_0%,rgba(205,226,243,0.98)_46%,rgba(237,244,251,0.97)_100%)] text-[#004b82] shadow-[0_8px_18px_rgba(0,75,130,0.12)] ring-1 ring-[#004b82]/8'
                    : 'text-[#374151] hover:border-[#d5bb87]/60 hover:bg-[linear-gradient(90deg,rgba(0,75,130,0.12)_0%,rgba(232,240,248,0.92)_100%)] hover:text-[#004b82] hover:shadow-[0_6px_14px_rgba(0,75,130,0.08)]',
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0 transition-all duration-200 ease-out', isActive ? 'text-[#004b82]' : 'text-[#607086] group-hover:text-[#004b82]')} />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
