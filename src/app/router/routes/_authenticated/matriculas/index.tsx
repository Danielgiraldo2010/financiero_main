import { createFileRoute, Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { cn } from '@/shared/lib/cn'

export const Route = createFileRoute('/_authenticated/matriculas/')({
  staticData: { breadcrumb: 'Matrículas' },
  component: MatriculasPage,
})

const TABS = [
  { to: '/matriculas/cohortes',      label: 'Cohortes' },
  { to: '/matriculas/resumen',       label: 'Resumen' },
  { to: '/matriculas/transferencias', label: 'Transferencias' },
  { to: '/matriculas/cobertura-pic', label: 'Cobertura PIC' },
  { to: '/matriculas/becas-posgrado', label: 'Becas Posgrado' },
]

function MatriculasPage() {
  const matchRoute = useMatchRoute()

  return (
    <div className="flex flex-col h-full">
      {/* Cabecera */}
      <div className="border-b px-6 pt-5 pb-0 space-y-1">
        <h1 className="text-xl font-semibold">Matrículas e Ingresos</h1>
        <p className="text-sm text-muted-foreground">
          Gestión de cohortes, transferencias, cobertura PIC y becas Minciencias
        </p>

        {/* Tabs de navegación */}
        <nav className="flex gap-1 pt-3 -mb-px">
          {TABS.map((tab) => {
            const active = !!matchRoute({ to: tab.to, fuzzy: false })
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/40',
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Contenido del tab activo */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  )
}
