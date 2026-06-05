import { createFileRoute, Outlet, Link, useRouterState } from '@tanstack/react-router'
import { cn } from '@/shared/lib/cn'

const TABS = [
  { label: 'Empleados',           to: '/nomina/empleados'           },
  { label: 'Puntos Salariales',   to: '/nomina/puntos-salariales'   },
  { label: 'Plan de Clases',      to: '/nomina/plan-clases'         },
  { label: 'Costos Parafiscales', to: '/nomina/costos-parafiscales' },
  { label: 'Liquidación',         to: '/nomina/liquidacion'         },
  { label: 'Conciliación',        to: '/nomina/conciliacion'        },
] as const

function NominaLayout() {
  const { location } = useRouterState()
  const pathname = location.pathname

  function isActive(to: string) {
    return pathname.startsWith(to)
  }

  return (
    <div className="flex min-w-0 flex-col gap-0">
      {/* Header del módulo */}
      <div className="flex items-center justify-between border-b border-[#dbe3ed] bg-white px-3 py-3 md:px-6">
        <h1 className="text-lg font-semibold text-[#19324d]">Nómina</h1>
      </div>

      {/* Tabs de navegación interna */}
      <div className="sf-tabs-shell px-3 md:px-6">
        <nav className="sf-tabs-nav" aria-label="Tabs de nómina">
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

      {/* Contenido */}
      <div className="px-0 py-4 md:px-6 md:py-6">
        <Outlet />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/nomina')({
  staticData: { breadcrumb: 'Nómina' },
  component: NominaLayout,
})
