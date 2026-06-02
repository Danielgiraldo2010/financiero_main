import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegistrarTransferenciaBecaSchema, type RegistrarTransferenciaBecaFormValues } from "../../../model/schema"
import { useRegistrarTransferenciaUE } from "../hook"
import { Dialog } from "@/shared/ui/modal/Dialog"

interface Props {
  becaId: number
  open: boolean
  onClose: () => void
}

export function RegistrarTransferenciaUEDialog({ becaId, open, onClose }: Props) {
  const mutation = useRegistrarTransferenciaUE()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegistrarTransferenciaBecaFormValues>({
    resolver: zodResolver(RegistrarTransferenciaBecaSchema),
    defaultValues: { id: becaId },
  })

  const onSubmit = async (values: RegistrarTransferenciaBecaFormValues) => {
    await mutation.mutateAsync({
      id: values.id,
      fechaResolucionMinisterio: values.fechaResolucionMinisterio,
      fechaGiroMinisterio: values.fechaGiroMinisterio,
      fechaTransferenciaUe: values.fechaTransferenciaUe,
    })
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Registrar Transferencia a UE"
      description="Registra las fechas del flujo Minciencias → Ministerio → Vicerrectoría Investigaciones → UE."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Fecha Resolución Ministerio</label>
          <input type="date" {...register("fechaResolucionMinisterio")} className="w-full border rounded px-3 py-2 text-sm" />
          {errors.fechaResolucionMinisterio && <p className="text-xs text-destructive">{errors.fechaResolucionMinisterio.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Fecha Giro Ministerio</label>
          <input type="date" {...register("fechaGiroMinisterio")} className="w-full border rounded px-3 py-2 text-sm" />
          {errors.fechaGiroMinisterio && <p className="text-xs text-destructive">{errors.fechaGiroMinisterio.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Fecha Transferencia a UE</label>
          <input type="date" {...register("fechaTransferenciaUe")} className="w-full border rounded px-3 py-2 text-sm" />
          {errors.fechaTransferenciaUe && <p className="text-xs text-destructive">{errors.fechaTransferenciaUe.message}</p>}
        </div>
        {mutation.isError && (
          <div className="text-sm text-destructive bg-destructive/10 rounded p-2">Error al registrar la transferencia.</div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded disabled:opacity-50">
            {mutation.isPending ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
