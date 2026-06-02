import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'

const TABS = [
  { label: 'Cierre de Vigencia', to: '/balance/cierre'        },
  { label: 'Recursos',           to: '/balance/recursos'       },
  { label: 'Conciliacion',       to: '/balance/conciliacion'   },
  { label: 'Recaudos',           to: '/balance/recaudos'       },
  { label: 'Flujo de Caja',      to: '/balance/flujo-caja'     },
] as const

function BalanceLayout() {
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

export const Route = createFileRoute('/_authenticated/balance')({
  staticData: { breadcrumb: 'Balance y Cierre' },
  component: BalanceLayout,
})
