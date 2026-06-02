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
    <div className="flex flex-col gap-0">
      {/* Header del módulo */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-lg font-semibold">Nómina</h1>
      </div>

      {/* Tabs de navegación interna */}
      <div className="border-b">
        <nav className="-mb-px flex gap-6 px-6 overflow-x-auto" aria-label="Tabs de nómina">
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

      {/* Contenido */}
      <div className="px-6 py-6">
        <Outlet />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/nomina')({
  staticData: { breadcrumb: 'Nómina' },
  component: NominaLayout,
})