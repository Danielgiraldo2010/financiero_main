import { useMiAgenda } from "../hook"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useAuthStore } from "@/shared/state/auth.store"  
import {
  SEMAFORO_ESTADO,
  LABEL_ESTADO,
} from "../../model/constants"
import type { MiAgendaItemResponse } from "../../model/types"

function PrioridadBadge({ prioridad }: { prioridad: string }) {
  const cls =
    prioridad === "ALTA" || prioridad === "CRITICA"
      ? "bg-red-50 text-red-700"
      : prioridad === "MEDIA" || prioridad === "NORMAL"
        ? "bg-orange-50 text-orange-700"
        : "bg-gray-100 text-gray-600"
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {prioridad}
    </span>
  )
}

function EventoRow({ item }: { item: MiAgendaItemResponse }) {
  const estadoClass = SEMAFORO_ESTADO[item.estado] ?? "text-gray-600 bg-gray-100"
  const completado = item.estado === "COMPLETADO"

  return (
    <div className={`flex items-start gap-4 p-4 border rounded-lg ${completado ? "opacity-60" : ""}`}>
      <div className="-shrink-0 mt-1">
        {completado ? (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-sm font-bold">
            V
          </span>
        ) : (
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${estadoClass}`}>
            {item.estado[0]}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{item.titulo}</span>
          <PrioridadBadge prioridad={item.prioridad} />
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${estadoClass}`}>
            {LABEL_ESTADO[item.estado] ?? item.estado}
          </span>
          {!item.visto && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
              Nuevo
            </span>
          )}
        </div>
        {item.descripcion && (
          <p className="text-xs text-muted-foreground mt-0.5">{item.descripcion}</p>
        )}
        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
          <span>Inicio: {new Date(item.fechaInicio).toLocaleDateString("es-CO")}</span>
          {item.fechaLimite && (
            <span className="text-red-600 font-medium">
              Limite: {new Date(item.fechaLimite).toLocaleDateString("es-CO")}
            </span>
          )}
          {item.entidadOrigenTipo && (
            <span>{item.entidadOrigenTipo} #{item.entidadOrigenId}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function MiAgendaPage() {
  // AJUSTAR: usar el hook/store de autenticación real del proyecto
  // para obtener el id del usuario autenticado (Guid como string)
  const { user } = useAuthStore()
  const usuarioId = user?.id ?? ""

  const { data, isLoading, isError } = useMiAgenda({ usuarioId })

  const items = data?.items ?? []
  const pendientes = items.filter((i: MiAgendaItemResponse) => i.estado !== "COMPLETADO" && i.estado !== "CANCELADO")
  const completados = items.filter((i: MiAgendaItemResponse) => i.estado === "COMPLETADO")

  if (!usuarioId) return <p className="text-sm text-muted-foreground p-6">Cargando sesion...</p>
  if (isLoading) return <p className="text-sm text-muted-foreground p-6">Cargando agenda...</p>
  if (isError) return <p className="text-sm text-destructive p-6">Error al cargar la agenda.</p>

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi Agenda"
        description="Eventos y compromisos presupuestales asignados a su rol"
      />

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">No tiene eventos asignados.</p>
      )}

      {pendientes.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">
            Pendientes ({pendientes.length})
          </h3>
          <div className="space-y-2">
            {pendientes.map((item: MiAgendaItemResponse) => (
              <EventoRow key={item.asignacionId} item={item} />
            ))}
          </div>
        </section>
      )}

      {completados.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Completados ({completados.length})
          </h3>
          <div className="space-y-2">
            {completados.map((item: MiAgendaItemResponse) => (
              <EventoRow key={item.asignacionId} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
