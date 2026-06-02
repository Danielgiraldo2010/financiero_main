import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ConfirmarRecepcionSchema, type ConfirmarRecepcionFormValues } from "../../../model/schema"
import { useConfirmarRecepcion } from "../hook"
import { Dialog } from "@/shared/ui/modal/Dialog"

interface Props {
  transferenciaId: number
  valorEsperado: number
  open: boolean
  onClose: () => void
}

export function ConfirmarRecepcionDialog({ transferenciaId, valorEsperado, open, onClose }: Props) {
  const mutation = useConfirmarRecepcion()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ConfirmarRecepcionFormValues>({
    resolver: zodResolver(ConfirmarRecepcionSchema),
    defaultValues: { id: transferenciaId, valorRecibido: valorEsperado },
  })

 const onSubmit = async (values: ConfirmarRecepcionFormValues) => {
  await mutation.mutateAsync({
    id:            values.id,
    valorRecibido: values.valorRecibido,
    fechaGiro:     values.fechaGiro,
    observaciones: values.observaciones ?? null,  // ← ?? null
  })
  reset()
  onClose()
}

  return (
    <Dialog open={open} onClose={onClose} title="Confirmar Recepción de Transferencia">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Valor Recibido</label>
          <input type="number" step="0.01" {...register("valorRecibido", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          {errors.valorRecibido && <p className="text-xs text-destructive">{errors.valorRecibido.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Fecha de Giro</label>
          <input type="date" {...register("fechaGiro")} className="w-full border rounded px-3 py-2 text-sm" />
          {errors.fechaGiro && <p className="text-xs text-destructive">{errors.fechaGiro.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Observaciones</label>
          <textarea {...register("observaciones")} rows={2} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded disabled:opacity-50">
            {mutation.isPending ? "Confirmando..." : "Confirmar"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
