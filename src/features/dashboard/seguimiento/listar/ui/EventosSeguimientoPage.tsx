import { useState } from "react"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useEventosSeguimiento } from "../hook"
import { useCompletarEvento } from "../../completar/hook"
import { useUIStore } from "@/shared/state/ui.store"
import type { EstadoEvento, EventoSeguimiento } from "../../../model/types"
import { EventoDetailDialog } from "../../detalle/ui/EventoDetailDialog"

const ESTADO_BADGE: Record<EstadoEvento, string> = {
  PENDIENTE:   "bg-yellow-100 text-yellow-800 border-yellow-200",
  EN_PROCESO:  "bg-blue-100 text-blue-800 border-blue-200",
  COMPLETADO:  "bg-green-100 text-green-800 border-green-200",
  VENCIDO:     "bg-red-100 text-red-800 border-red-200",
}

export function EventosSeguimientoPage() {
  const vigenciaActiva = useUIStore((s) => s.vigenciaActiva)
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoEvento | undefined>(undefined)
  const [detalle, setDetalle] = useState<EventoSeguimiento | null>(null)

  const { data: eventos = [], isLoading } = useEventosSeguimiento({
    vigencia: vigenciaActiva,
    ...(estadoFiltro ? { estado: estadoFiltro } : {}),
  })
  const { mutate: completar, isPending: completando } = useCompletarEvento()

  const ESTADOS: { value: EstadoEvento | undefined; label: string }[] = [
    { value: undefined,      label: "Todos" },
    { value: "PENDIENTE",    label: "Pendientes" },
    { value: "EN_PROCESO",   label: "En proceso" },
    { value: "VENCIDO",      label: "Vencidos" },
    { value: "COMPLETADO",   label: "Completados" },
  ]

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <span>/</span>
        <span className="text-foreground font-medium">Seguimiento</span>
      </nav>

      <PageHeader
        title="Seguimiento de eventos"
        description={`Eventos de la vigencia ${vigenciaActiva}`}
      />

      <div className="flex flex-wrap gap-2">
        {ESTADOS.map((e) => (
          <button
            key={String(e.value)}
            type="button"
            onClick={() => setEstadoFiltro(e.value)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              estadoFiltro === e.value
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-muted"
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg border bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && eventos.length === 0 && (
        <div className="rounded-lg border-2 border-dashed p-10 text-center text-sm text-muted-foreground">
          No hay eventos para los filtros seleccionados.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {eventos.map((ev) => (
          <div
            key={ev.id}
            className="rounded-lg border bg-background p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                className="flex-1 text-left"
                onClick={() => setDetalle(ev)}
              >
                <p className="text-sm font-semibold">{ev.titulo}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ev.tipo} · Vence: {ev.fechaLimite}
                </p>
                {ev.proyectoNombre && (
                  <p className="text-xs text-muted-foreground">{ev.proyectoNombre}</p>
                )}
              </button>
              <span className={`shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium ${ESTADO_BADGE[ev.estado]}`}>
                {ev.estado}
              </span>
            </div>
            {ev.estado === "PENDIENTE" || ev.estado === "EN_PROCESO" ? (
              <div className="mt-3">
                <button
                  type="button"
                  disabled={completando}
                  onClick={() => completar(ev.id)}
                  className="rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted disabled:opacity-40"
                >
                  Marcar completado
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {detalle && (
        <EventoDetailDialog evento={detalle} onClose={() => setDetalle(null)} />
      )}
    </div>
  )
}
