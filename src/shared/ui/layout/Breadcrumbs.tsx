import { Link, useMatches } from '@tanstack/react-router'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbMeta {
  breadcrumb?: string
}

export function Breadcrumbs() {
  const matches = useMatches()

  const crumbs = matches
    .filter((m) => (m.staticData as BreadcrumbMeta | undefined)?.breadcrumb)
    .map((m) => ({
      label: (m.staticData as BreadcrumbMeta).breadcrumb!,
      path: m.pathname,
    }))

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm text-[#6b7280]">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center transition-colors hover:text-[#004b82]"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-[#9ca3af]" />
            {index === crumbs.length - 1 ? (
              <span className="font-medium text-[#1f2937]">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="transition-colors hover:text-[#004b82]"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
