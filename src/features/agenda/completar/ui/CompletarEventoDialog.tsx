import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { useCompletarEventoAgenda } from "../hook"
import { completarEventoSchema, type CompletarEventoForm } from "../../model/schema"
import type { AgendaEventoResponse } from "../../model/types"

interface Props {
  evento: AgendaEventoResponse
  open: boolean
  onClose: () => void
}

export function CompletarEventoDialog({ evento, open, onClose }: Props) {
  const { mutate, isPending } = useCompletarEventoAgenda()

  const { register, handleSubmit } = useForm<CompletarEventoForm>({
    resolver: zodResolver(completarEventoSchema),
  })

  function onSubmit(data: CompletarEventoForm) {
    mutate(
      { id: evento.id, body: { observacion: data.observacion ?? null } },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Completar evento" maxWidth="sm">
      <p className="text-sm text-muted-foreground mb-3">
        Marcar como completado: <strong>{evento.titulo}</strong>
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Observacion</label>
          <textarea
            className="input w-full"
            rows={3}
            {...register("observacion")}
            placeholder="Observacion opcional..."
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? "Guardando..." : "Completar"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
