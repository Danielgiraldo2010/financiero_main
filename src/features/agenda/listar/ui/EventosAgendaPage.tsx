import { useState } from "react"
import { useEventosAgenda } from "../hook"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { CrearEventoDialog } from "../../crear/ui/CrearEventoDialog"
import { CompletarEventoDialog } from "../../completar/ui/CompletarEventoDialog"
import { CancelarEventoDialog } from "../../cancelar/ui/CancelarEventoDialog"
import { ActualizarEventoDialog } from "../../actualizar/ui/ActualizarEventoDialog"
import { SEMAFORO_ESTADO, LABEL_ESTADO } from "../../model/constants"
import type { AgendaEventoResponse } from "../../model/types"

export function EventosAgendaPage() {
  const [pagina, setPagina] = useState(1)
  const { data, isLoading, isError } = useEventosAgenda({ pagina, elementosPorPagina: 20 })

  const eventos = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1

  const [crearOpen, setCrearOpen] = useState(false)
  const [completar, setCompletar] = useState<AgendaEventoResponse | null>(null)
  const [cancelar, setCancelar] = useState<AgendaEventoResponse | null>(null)
  const [editar, setEditar] = useState<AgendaEventoResponse | null>(null)

  if (isLoading) return <p className="text-sm text-muted-foreground p-6">Cargando...</p>
  if (isError) return <p className="text-sm text-destructive p-6">Error al cargar eventos.</p>

  return (
    <div className="space-y-4">
      <PageHeader
        title="Gestión de Eventos"
        description="Administre los eventos presupuestales de la unidad"
        actions={<Button size="sm" onClick={() => setCrearOpen(true)}>+ Nuevo evento</Button>}
      />

      {eventos.length === 0 && (
        <p className="text-sm text-muted-foreground">No hay eventos registrados.</p>
      )}

      <div className="space-y-2">
        {eventos.map((ev: AgendaEventoResponse) => {
          const estadoClass = SEMAFORO_ESTADO[ev.estado] ?? "text-gray-600 bg-gray-100"
          const completado = ev.estado === "COMPLETADO"
          const cancelado = ev.estado === "CANCELADO"
          return (
            <div key={ev.id} className="corporate-card flex items-start gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[#1f2937]">{ev.titulo}</span>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${estadoClass}`}>
                    {LABEL_ESTADO[ev.estado] ?? ev.estado}
                  </span>
                  {ev.prioridad === "ALTA" && (
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                      Alta prioridad
                    </span>
                  )}
                </div>
                {ev.descripcion && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{ev.descripcion}</p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span>Inicio: {new Date(ev.fechaInicio).toLocaleDateString("es-CO")}</span>
                  {ev.fechaLimite && (
                    <span className="font-medium text-red-600">
                      Límite: {new Date(ev.fechaLimite).toLocaleDateString("es-CO")}
                    </span>
                  )}
                  <span>{ev.unidadEjecutoraNombre ?? "—"}</span>
                </div>
              </div>
              {!completado && !cancelado && (
                <div className="flex shrink-0 items-center gap-2">
                  <Button size="xs" variant="secondary" onClick={() => setEditar(ev)}>Editar</Button>
                  <Button size="xs" variant="outline" onClick={() => setCompletar(ev)}>Completar</Button>
                  <Button size="xs" variant="destructive" onClick={() => setCancelar(ev)}>Cancelar</Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button size="sm" variant="secondary" onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}>
            Anterior
          </Button>
          <span className="text-xs text-muted-foreground">Página {pagina} de {totalPaginas}</span>
          <Button size="sm" variant="secondary" onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>
            Siguiente
          </Button>
        </div>
      )}

      <CrearEventoDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {completar && <CompletarEventoDialog evento={completar} open onClose={() => setCompletar(null)} />}
      {cancelar && <CancelarEventoDialog evento={cancelar} open onClose={() => setCancelar(null)} />}
      {editar && <ActualizarEventoDialog evento={editar} open onClose={() => setEditar(null)} />}
    </div>
  )
}
