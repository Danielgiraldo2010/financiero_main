import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAnularCohorte } from "../hook"
import { Dialog } from "@/shared/ui/modal/Dialog"
import type { CohorteResponse } from "../../../model/types"

const AnularCohorteSchema = z.object({
  motivo: z.string().min(10, "El motivo debe tener al menos 10 caracteres"),
})

type AnularCohorteFormValues = z.infer<typeof AnularCohorteSchema>

interface Props {
  cohorte: CohorteResponse
  open: boolean
  onClose: () => void
}

export function AnularCohorteDialog({ cohorte, open, onClose }: Props) {
  const mutation = useAnularCohorte()
  const { register, handleSubmit, formState: { errors }, reset } =
    useForm<AnularCohorteFormValues>({ resolver: zodResolver(AnularCohorteSchema) })

  const onSubmit = async (values: AnularCohorteFormValues) => {
    await mutation.mutateAsync({ id: cohorte.id, motivo: values.motivo })
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Anular Cohorte"
      description={`${cohorte.programaAcademico} — Cohorte ${cohorte.cohorte} · Período ${cohorte.periodo}. Esta acción no se puede revertir si hay giros registrados.`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-destructive/10 border border-destructive/30 rounded p-3 text-sm text-destructive">
          ⚠️ La anulación es permanente. Solo es posible si la cohorte no tiene giros registrados.
        </div>
        <div>
          <label className="text-sm font-medium">Motivo de anulación</label>
          <textarea
            {...register("motivo")}
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Describa el motivo de la anulación (mínimo 10 caracteres)"
          />
          {errors.motivo && <p className="text-xs text-destructive">{errors.motivo.message}</p>}
        </div>
        {mutation.isError && (
          <div className="text-sm text-destructive bg-destructive/10 rounded p-2">
            No se pudo anular la cohorte. Verifique que no tenga giros registrados.
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded hover:bg-muted">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded disabled:opacity-50">
            {mutation.isPending ? "Anulando..." : "Confirmar Anulación"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
