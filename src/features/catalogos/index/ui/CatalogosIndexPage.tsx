import { Link, Outlet, useMatchRoute } from "@tanstack/react-router"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { cn } from "@/shared/lib/cn"

const GRUPOS = [
  { label: "Presupuesto", id: "presupuesto" },
  { label: "Académico",   id: "academico" },
  { label: "Nómina",      id: "nomina" },
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
    { label: "Fechas Límite",       to: "/catalogos/fechas-limite" },
  ],
  academico: [
    { label: "Programas",        to: "/catalogos/programas-academicos" },
    { label: "Periodos",         to: "/catalogos/periodos-academicos" },
    { label: "Tipos Proyecto",   to: "/catalogos/tipos-proyecto" },
    { label: "Descuentos",       to: "/catalogos/descuentos" },
    { label: "Apoyos Matrícula", to: "/catalogos/apoyos-matricula" },
  ],
  nomina: [
    { label: "Conceptos Nómina", to: "/catalogos/conceptos-nomina" },
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
  const grupoActivoLabel = GRUPOS.find((g) => g.id === grupoActivo)?.label ?? "Presupuesto"

  return (
    <div className="flex flex-col gap-5">
      <section className="corporate-card overflow-hidden">
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#ffffff_62%,#edf4fb_100%)] px-5 py-5 sm:px-7">
          <div
            className="pointer-events-none absolute -right-14 -top-16 h-36 w-36 rounded-full bg-[#d5bb87]/18 blur-2xl"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <PageHeader
              title="Catálogos"
              description="Administra los catálogos maestros del sistema financiero"
            />
            <div className="flex w-fit items-center gap-2 rounded-full border border-[#d5bb87]/45 bg-[#fff8e6] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6f4d12] shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#004b82]" aria-hidden="true" />
              {grupoActivoLabel}
            </div>
          </div>
        </div>

        {/* Nivel 1 — tabs de grupo */}
        <div className="border-t border-[#dbe3ed] bg-[#f8fbfe] px-5 py-4 sm:px-7">
          <nav
            className="inline-flex max-w-full gap-1 overflow-x-auto rounded-[16px] border border-[#dbe3ed] bg-white p-1 shadow-[0_4px_12px_rgba(15,23,42,0.08)] scrollbar-none"
            aria-label="Grupos de catálogos"
          >
            {GRUPOS.map((g) => {
              const primeraRuta = ENTIDADES[g.id][0].to
              return (
                <Link
                  key={g.id}
                  to={primeraRuta}
                  className={cn(
                    "shrink-0 rounded-[12px] px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-out",
                    grupoActivo === g.id
                      ? "bg-[#004b82] text-white shadow-[0_8px_18px_rgba(0,75,130,0.18)]"
                      : "text-[#4b5c70] hover:bg-[#edf4fb] hover:text-[#004b82]",
                  )}
                >
                  {g.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Nivel 2 — tabs de entidad dentro del grupo activo */}
        <div className="border-t border-[#dbe3ed] bg-white px-5 py-3 sm:px-7">
          <nav
            className="flex gap-2 overflow-x-auto scrollbar-none"
            aria-label="Entidades"
          >
            {tabsActivos.map((tab) => {
              const active = matchRoute({ to: tab.to, fuzzy: true })
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={cn(
                    "shrink-0 rounded-[12px] border px-3.5 py-2 text-sm font-semibold transition-all duration-200 ease-out",
                    active
                      ? "border-[#004b82]/25 bg-[#edf4fb] text-[#004b82] shadow-[0_4px_12px_rgba(15,23,42,0.08)]"
                      : "border-transparent text-[#526173] hover:border-[#d5bb87]/55 hover:bg-[#fff8e6] hover:text-[#004b82]",
                  )}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </section>
      <Outlet />
    </div>
  )
}
