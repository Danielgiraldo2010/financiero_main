// DESTINO: src/app/router/routes/_authenticated/presupuesto.tsx
// Correcciones:
//   1. Usa vigenciaActiva del store (nunca undefined — inicializa con new Date().getFullYear())
//   2. Selector de vigencia visible en el header del layout
//   3. Pasa vigencia como prop a Outlet via context para evitar re-reads del store en cada hijo
import { createFileRoute, Outlet, Link, useRouterState } from '@tanstack/react-router'
import { useUIStore } from '@/shared/state/ui.store'
import { cn } from '@/shared/lib/cn'
import { PageHeader } from '@/shared/ui/layout/PageHeader'

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
    <div className="flex flex-col gap-5">
      {/* Header del módulo: título + selector de vigencia */}
      <section className="corporate-card overflow-hidden">
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#ffffff_64%,#edf4fb_100%)] px-5 py-5 sm:px-7">
          <div
            className="pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full bg-[#d5bb87]/18 blur-2xl"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <PageHeader
              title="Presupuesto UE"
              description={`Gestión presupuestal de la vigencia ${vigenciaActiva}`}
            />
            <label className="flex w-fit items-center gap-3 rounded-[16px] border border-[#dbe3ed] bg-white px-3.5 py-2 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                Vigencia
              </span>
              <select
                value={vigenciaActiva}
                onChange={(e) => setVigencia(Number(e.target.value))}
                className="h-9 min-w-[92px] rounded-[12px] border border-[#d6e0ea] bg-[#f8fbfe] px-3 text-sm font-bold text-[#1f2937] shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] outline-none transition-all duration-200 ease-out focus:border-[#004b82] focus:ring-4 focus:ring-[#004b82]/12"
              >
                {VIGENCIAS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Tabs de navegación interna */}
        <div className="border-t border-[#dbe3ed] bg-white px-5 py-3 sm:px-7">
          <nav className="flex gap-2 overflow-x-auto scrollbar-none" aria-label="Tabs de presupuesto">
            {TABS.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  'shrink-0 rounded-[12px] border px-3.5 py-2 text-sm font-semibold transition-all duration-200 ease-out',
                  isActive(tab.to)
                    ? 'border-[#004b82]/25 bg-[#edf4fb] text-[#004b82] shadow-[0_4px_12px_rgba(15,23,42,0.08)]'
                    : 'border-transparent text-[#526173] hover:border-[#d5bb87]/55 hover:bg-[#fff8e6] hover:text-[#004b82]',
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

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
