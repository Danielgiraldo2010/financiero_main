// DESTINO: src/app/router/routes/_authenticated/presupuesto.tsx
// Correcciones:
//   1. Usa vigenciaActiva del store (nunca undefined — inicializa con new Date().getFullYear())
//   2. Selector de vigencia visible en el header del layout
//   3. Pasa vigencia como prop a Outlet via context para evitar re-reads del store en cada hijo
import { createFileRoute, Outlet, Link, useRouterState } from '@tanstack/react-router'
import { useUIStore } from '@/shared/state/ui.store'
import { cn } from '@/shared/lib/cn'

// Rango de vigencias disponibles — ajustar según necesidad institucional
const VIGENCIAS = Array.from(
  { length: 6 },
  (_, i) => new Date().getFullYear() - 2 + i,  // 2 años atrás hasta 3 adelante
)

const TABS = [
  { label: 'Resumen',           to: '/presupuesto'                    },
  { label: 'Ingresos',          to: '/presupuesto/ingresos'           },
  { label: 'Gastos',            to: '/presupuesto/gastos'             },
  { label: 'Etapas',            to: '/presupuesto/etapas'             },
  { label: 'Ejecución Mensual', to: '/presupuesto/ejecucion-mensual'  },
] as const

function PresupuestoLayout() {
  const { location } = useRouterState()
  const pathname = location.pathname
  const vigenciaActiva = useUIStore((s) => s.vigenciaActiva)
  const setVigencia = useUIStore((s) => s.setVigencia)

  function isActive(to: string) {
    if (to === '/presupuesto') {
      return pathname === '/presupuesto' || pathname === '/presupuesto/'
    }
    return pathname.startsWith(to)
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Header del módulo: título + selector de vigencia */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-lg font-semibold">Presupuesto UE</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Vigencia</span>
          <select
            value={vigenciaActiva}
            onChange={(e) => setVigencia(Number(e.target.value))}
            className="h-8 rounded-md border bg-background px-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {VIGENCIAS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs de navegación interna */}
      <div className="border-b">
        <nav className="-mb-px flex gap-6 px-6" aria-label="Tabs de presupuesto">
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

      {/* Contenido de la ruta hija activa */}
      <div className="px-6 py-6">
        <Outlet />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/presupuesto')({
  component: PresupuestoLayout,
})
