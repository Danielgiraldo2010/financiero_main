import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { useCancelarEventoAgenda } from "../hook"
import { cancelarEventoSchema, type CancelarEventoForm } from "../../model/schema"
import type { AgendaEventoResponse } from "../../model/types"

interface Props {
  evento: AgendaEventoResponse
  open: boolean
  onClose: () => void
}

export function CancelarEventoDialog({ evento, open, onClose }: Props) {
  const { mutate, isPending } = useCancelarEventoAgenda()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CancelarEventoForm>({
    resolver: zodResolver(cancelarEventoSchema),
  })

  function onSubmit(data: CancelarEventoForm) {
    mutate(
      { id: evento.id, body: data },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Cancelar evento" maxWidth="sm">
      <p className="text-sm text-muted-foreground mb-3">
        Cancelar: <strong>{evento.titulo}</strong>. Esta accion no puede deshacerse.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Motivo</label>
          <textarea
            className="input w-full"
            rows={3}
            {...register("motivo")}
            placeholder="Explique el motivo de la cancelacion..."
          />
          {errors.motivo && (
            <p className="text-xs text-destructive mt-0.5">{errors.motivo.message}</p>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn-secondary" onClick={onClose}>Volver</button>
          <button
            type="submit"
            className="btn-destructive"
            disabled={isPending}
          >
            {isPending ? "Cancelando..." : "Confirmar cancelacion"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
