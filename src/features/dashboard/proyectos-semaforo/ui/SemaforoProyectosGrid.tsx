import type { ProyectoEstadoDashboard, ColorSemaforo } from "../../model/types"

interface Props {
  proyectos: ProyectoEstadoDashboard[]
}

const COLOR_CLASES: Record<ColorSemaforo, { ring: string; dot: string; bg: string }> = {
  VERDE:    { ring: "border-green-400",  dot: "bg-green-500",  bg: "bg-green-50" },
  AMARILLO: { ring: "border-yellow-400", dot: "bg-yellow-400", bg: "bg-yellow-50" },
  ROJO:     { ring: "border-red-400",    dot: "bg-red-500",    bg: "bg-red-50" },
}

function formatCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    notation: "compact",
    compactDisplay: "short",
  }).format(n)
}

function ProyectoCard({ p }: { p: ProyectoEstadoDashboard }) {
  const c =
  COLOR_CLASES[p.semaforoColor] ??
  COLOR_CLASES.ROJO
  return (
    <div className={`rounded-lg border-2 ${c.ring} ${c.bg} p-4 shadow-sm`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-mono text-muted-foreground">{p.codigo}</p>
          <p className="mt-0.5 text-sm font-semibold leading-tight line-clamp-2">{p.nombre}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{p.unidadEjecutoraNombre}</p>
        </div>
        <span className={`mt-0.5 h-3 w-3 shrink-0 rounded-full ${c.dot}`} title={p.semaforoColor} />
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Ejecucion</span>
          <span>{p.porcentajeEjecucion.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/60">
          <div
            className={`h-1.5 rounded-full ${c.dot}`}
            style={{ width: `${Math.min(p.porcentajeEjecucion, 100)}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {formatCOP(p.valorEjecutado)} / {formatCOP(p.valorTotal)}
        </p>
        <p className="mt-1 text-xs font-medium">{p.semaforoMensaje}</p>
      </div>
    </div>
  )
}

export function SemaforoProyectosGrid({ proyectos }: Props) {
  if (proyectos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        No hay proyectos activos en esta vigencia.
      </p>
    )
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {proyectos.map((p) => (
        <ProyectoCard key={p.id} p={p} />
      ))}
    </div>
  )
}
