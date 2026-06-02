import { Link, Outlet, useMatchRoute } from "@tanstack/react-router"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { cn } from "@/shared/lib/cn"

const GRUPOS = [
  { label: "Presupuesto", id: "presupuesto" },
  { label: "Academico",   id: "academico" },
  { label: "Nomina",      id: "nomina" },
  { label: "Territorial", id: "territorial" },
] as const

type GrupoId = typeof GRUPOS[number]["id"]

// "as const satisfies" — TS infiere cada array como un tuple readonly,
// lo que permite indexar con GrupoId sin TS2532
const ENTIDADES = {
  presupuesto: [
    { label: "Unidades Ejecutoras", to: "/catalogos/unidades-ejecutoras" },
    { label: "Rubros Ingreso",      to: "/catalogos/rubros-ingreso" },
    { label: "Rubros Gasto",        to: "/catalogos/rubros-gasto" },
    { label: "Fuentes Recursos",    to: "/catalogos/fuentes-recursos" },
    { label: "Fechas Limite",       to: "/catalogos/fechas-limite" },
  ],
  academico: [
    { label: "Programas",        to: "/catalogos/programas-academicos" },
    { label: "Periodos",         to: "/catalogos/periodos-academicos" },
    { label: "Tipos Proyecto",   to: "/catalogos/tipos-proyecto" },
    { label: "Descuentos",       to: "/catalogos/descuentos" },
    { label: "Apoyos Matricula", to: "/catalogos/apoyos-matricula" },
  ],
  nomina: [
    { label: "Conceptos Nomina", to: "/catalogos/conceptos-nomina" },
  ],
  territorial: [
    { label: "Municipios", to: "/catalogos/municipios" },
  ],
} as const satisfies Record<GrupoId, readonly { label: string; to: string }[]>

function detectarGrupo(matchRoute: ReturnType<typeof useMatchRoute>): GrupoId {
  for (const [grupo, tabs] of Object.entries(ENTIDADES) as [GrupoId, readonly { to: string }[]][]) {
    if (tabs.some((t) => matchRoute({ to: t.to, fuzzy: true }))) return grupo
  }
  return "presupuesto"
}

export function CatalogosIndexPage() {
  const matchRoute = useMatchRoute()
  const grupoActivo = detectarGrupo(matchRoute)
  const tabsActivos = ENTIDADES[grupoActivo]

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-[#dbe3ed] bg-white px-6 pt-6">
        <PageHeader
          title="Catalogos"
          description="Administra los catalogos maestros del sistema financiero"
        />

        {/* Nivel 1 — tabs de grupo */}
        <nav className="flex gap-1 pt-4" aria-label="Grupos de catalogos">
          {GRUPOS.map((g) => {
            const primeraRuta = ENTIDADES[g.id][0].to
            return (
              <Link
                key={g.id}
                to={primeraRuta}
                className={cn(
                  "rounded-t-md px-4 py-2 text-sm font-semibold transition-colors",
                  grupoActivo === g.id
                    ? "bg-[#edf4fb] text-[#004b82]"
                    : "text-[#4b5c70] hover:bg-[#f8fbfe] hover:text-[#19324d]",
                )}
              >
                {g.label}
              </Link>
            )
          })}
        </nav>

        {/* Nivel 2 — tabs de entidad dentro del grupo activo */}
        <nav
          className="sf-tabs-nav overflow-x-auto border-t border-[#dbe3ed] pt-1 scrollbar-none"
          aria-label="Entidades"
        >
          {tabsActivos.map((tab) => {
            const active = matchRoute({ to: tab.to, fuzzy: true })
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  "sf-tab shrink-0 px-3 pb-3",
                  active
                    ? "sf-tab-active"
                    : "",
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <Outlet />
    </div>
  )
}
