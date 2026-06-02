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
      <div className="flex items-center justify-between border-b border-[#dbe3ed] bg-white px-6 py-3">
        <h1 className="text-lg font-semibold text-[#19324d]">SAR / Viáticos</h1>
      </div>
      <div className="sf-tabs-shell px-6">
        <nav className="sf-tabs-nav" aria-label="Tabs SAR/Viáticos">
          {TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                'sf-tab',
                isActive(tab.to)
                  ? 'sf-tab-active'
                  : '',
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
