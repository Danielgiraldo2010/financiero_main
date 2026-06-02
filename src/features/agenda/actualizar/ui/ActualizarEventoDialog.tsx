import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { useActualizarEventoAgenda } from "../hook"
import { actualizarEventoSchema, type ActualizarEventoForm } from "../../model/schema"
import { TIPOS_EVENTO, PRIORIDADES_EVENTO } from "../../model/constants"
import type { AgendaEventoResponse } from "../../model/types"

interface Props {
  evento: AgendaEventoResponse
  open: boolean
  onClose: () => void
}

export function ActualizarEventoDialog({ evento, open, onClose }: Props) {
  const { mutate, isPending } = useActualizarEventoAgenda()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ActualizarEventoForm>({
    resolver: zodResolver(actualizarEventoSchema),
    defaultValues: {
      titulo: evento.titulo,
      descripcion: evento.descripcion ?? null,
      tipo: evento.tipo,
      prioridad: evento.prioridad,
      unidadEjecutoraId: evento.unidadEjecutoraId ?? null,
      fechaInicio: evento.fechaInicio.slice(0, 16),
      fechaFin: evento.fechaFin ? evento.fechaFin.slice(0, 16) : null,
      fechaLimite: evento.fechaLimite ?? null,
      esRecurrente: evento.esRecurrente,
      patronRecurrencia: evento.patronRecurrencia ?? null,
    },
  })

  const esRecurrente = watch("esRecurrente")

  function onSubmit(data: ActualizarEventoForm) {
    mutate(
      {
        id: evento.id,
        body: {
          ...data,
          unidadEjecutoraId: data.unidadEjecutoraId ?? null,
          descripcion: data.descripcion ?? null,
          fechaFin: data.fechaFin ?? null,
          fechaLimite: data.fechaLimite ?? null,
          patronRecurrencia: data.patronRecurrencia ?? null,
          entidadOrigenTipo: data.entidadOrigenTipo ?? null,
          entidadOrigenId: data.entidadOrigenId ?? null,
        },
      },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Editar evento" maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titulo</label>
          <input className="input w-full" {...register("titulo")} />
          {errors.titulo && <p className="text-xs text-destructive mt-0.5">{errors.titulo.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripcion</label>
          <textarea className="input w-full" rows={2} {...register("descripcion")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select className="input w-full" {...register("tipo")}>
              {TIPOS_EVENTO.map((t: string) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prioridad</label>
            <select className="input w-full" {...register("prioridad")}>
              {PRIORIDADES_EVENTO.map((p: string) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha inicio</label>
            <input type="datetime-local" className="input w-full" {...register("fechaInicio")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha fin</label>
            <input type="datetime-local" className="input w-full" {...register("fechaFin")} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha limite</label>
          <input type="date" className="input w-full" {...register("fechaLimite")} />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="esRec" {...register("esRecurrente")} className="h-4 w-4" />
          <label htmlFor="esRec" className="text-sm">Es recurrente</label>
        </div>

        {esRecurrente && (
          <div>
            <label className="block text-sm font-medium mb-1">Patron de recurrencia</label>
            <input className="input w-full" {...register("patronRecurrencia")} />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? "Guardando..." : "Actualizar"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
