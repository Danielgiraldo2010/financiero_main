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
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5" />
            {index === crumbs.length - 1 ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-foreground transition-colors"
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