import type { ProyectoEstadoDashboard, ColorSemaforo } from "../../model/types"
import { FolderKanban } from "lucide-react"

interface Props {
  proyectos: ProyectoEstadoDashboard[]
}

const COLOR_CLASES: Record<ColorSemaforo, { ring: string; dot: string; bg: string; text: string }> = {
  VERDE:    { ring: "border-green-300",  dot: "bg-green-500",  bg: "bg-green-50",  text: "text-green-800" },
  AMARILLO: { ring: "border-yellow-300", dot: "bg-yellow-400", bg: "bg-yellow-50", text: "text-yellow-800" },
  ROJO:     { ring: "border-red-300",    dot: "bg-red-500",    bg: "bg-red-50",    text: "text-red-800" },
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
    <div className={`group overflow-hidden rounded-[16px] border ${c.ring} ${c.bg} p-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-200 ease-out hover:shadow-[0_8px_18px_rgba(15,23,42,0.10)]`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{p.codigo}</p>
          <p className="mt-1 text-base font-bold leading-tight line-clamp-2 text-[#1f2937]">{p.nombre}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">{p.unidadEjecutoraNombre}</p>
        </div>
        <span className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full ${c.dot} shadow-[0_0_0_5px_rgba(255,255,255,0.72)]`} title={p.semaforoColor} />
      </div>
      <div className="mt-4 rounded-[16px] bg-white/78 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="mb-2 flex items-end justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Ejecucion</span>
          <span className={`text-2xl font-bold tracking-[-0.04em] tabular-nums ${c.text}`}>{p.porcentajeEjecucion.toFixed(1)}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white shadow-[inset_0_1px_2px_rgba(0,75,130,0.10)]">
          <div
            className={`h-full rounded-full ${c.dot} transition-all duration-300`}
            style={{ width: `${Math.min(p.porcentajeEjecucion, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-muted-foreground">
          {formatCOP(p.valorEjecutado)} / {formatCOP(p.valorTotal)}
        </p>
        <p className="mt-1.5 text-xs font-bold leading-4 text-[#1f2937]">{p.semaforoMensaje}</p>
      </div>
    </div>
  )
}

export function SemaforoProyectosGrid({ proyectos }: Props) {
  if (proyectos.length === 0) {
    return (
      <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed border-[rgba(15,23,42,0.08)] bg-white p-8 text-center shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf4fb] text-[#004b82]">
          <FolderKanban className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold text-[#1f2937]">No hay proyectos activos</p>
          <p className="mt-1 text-xs text-muted-foreground">No hay proyectos activos en esta vigencia.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {proyectos.map((p) => (
        <ProyectoCard key={p.id} p={p} />
      ))}
    </div>
  )
}
