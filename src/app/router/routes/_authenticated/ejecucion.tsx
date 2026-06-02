import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'

const TABS = [
  { label: 'CDP',               to: '/ejecucion/cdp'       },
  { label: 'Reg. Presupuestal', to: '/ejecucion/rp'        },
  { label: 'Órdenes de Pago',   to: '/ejecucion/op'        },
  { label: 'Reservas',          to: '/ejecucion/reservas'  },
  { label: 'Radicación',        to: '/ejecucion/radicacion'},
  { label: 'Avances',           to: '/ejecucion/avances'   },
  { label: 'Reportes',          to: '/ejecucion/reportes'  },
] as const

function EjecucionLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div className="flex flex-col min-h-0">
      <div className="border-b bg-background px-6 overflow-x-auto">
        <nav className="flex gap-1 -mb-px min-w-max">
          {TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={[
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                pathname.startsWith(tab.to)
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground',
              ].join(' ')}
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

export const Route = createFileRoute('/_authenticated/ejecucion')({
  staticData: { breadcrumb: 'Ejecución Presupuestal' },
  component: EjecucionLayout,
})
