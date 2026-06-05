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
    <div className="flex h-full min-w-0 flex-col">
      {/* Cabecera */}
      <div className="space-y-1 border-b border-[#dbe3ed] bg-white px-3 pb-0 pt-4 md:px-6 md:pt-5">
        <h1 className="text-xl font-semibold text-[#19324d]">Matrículas e Ingresos</h1>
        <p className="text-sm text-muted-foreground">
          Gestión de cohortes, transferencias, cobertura PIC y becas Minciencias
        </p>

        {/* Tabs de navegación */}
        <nav className="sf-tabs-nav overflow-x-auto pt-3 scrollbar-none">
          {TABS.map((tab) => {
            const active = !!matchRoute({ to: tab.to, fuzzy: false })
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  'sf-tab',
                  active
                    ? 'sf-tab-active'
                    : '',
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Contenido del tab activo */}
      <div className="min-w-0 flex-1 overflow-y-auto px-0 py-4 md:p-6">
        <Outlet />
      </div>
    </div>
  )
}
