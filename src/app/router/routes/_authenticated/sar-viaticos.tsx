import { createFileRoute, Outlet, Link, useRouterState } from '@tanstack/react-router'
import { cn } from '@/shared/lib/cn'

const TABS = [
  { label: 'Resumen',   to: '/sar-viaticos'          },
  { label: 'SAR',       to: '/sar-viaticos/sar'       },
  { label: 'Viáticos',  to: '/sar-viaticos/viaticos'  },
  { label: 'Tarifas',   to: '/sar-viaticos/tarifas'   },
] as const

function SarViaticosLayout() {
  const { location } = useRouterState()
  const pathname = location.pathname

  function isActive(to: string) {
    if (to === '/sar-viaticos') return pathname === '/sar-viaticos' || pathname === '/sar-viaticos/'
    return pathname.startsWith(to)
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-lg font-semibold">SAR / Viáticos</h1>
      </div>
      <div className="border-b">
        <nav className="-mb-px flex gap-6 px-6 overflow-x-auto" aria-label="Tabs SAR/Viáticos">
          {TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                'whitespace-nowrap border-b-2 pb-3 pt-3 text-sm font-medium transition-colors',
                isActive(tab.to)
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-6 py-6">
        <Outlet />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/sar-viaticos')({
  staticData: { breadcrumb: 'SAR / Viáticos' },
  component: SarViaticosLayout,
})