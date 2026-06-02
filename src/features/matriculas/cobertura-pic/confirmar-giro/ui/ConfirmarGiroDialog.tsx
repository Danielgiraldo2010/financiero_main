import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ConfirmarGiroSchema, type ConfirmarGiroFormValues } from "../../../model/schema"
import { useConfirmarGiroPic } from "../hook"
import { Dialog } from "@/shared/ui/modal/Dialog"

interface Props {
  coberturaId: number
  open: boolean
  onClose: () => void
}

export function ConfirmarGiroDialog({ coberturaId, open, onClose }: Props) {
  const mutation = useConfirmarGiroPic()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ConfirmarGiroFormValues>({
    resolver: zodResolver(ConfirmarGiroSchema),
    defaultValues: { id: coberturaId },
  })

  const onSubmit = async (values: ConfirmarGiroFormValues) => {
    await mutation.mutateAsync({ id: values.id, fechaGiro: values.fechaGiro, urlSoporte: values.urlSoporte ?? null })
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title="Confirmar Giro PIC">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Fecha de Giro</label>
          <input type="date" {...register("fechaGiro")} className="w-full border rounded px-3 py-2 text-sm" />
          {errors.fechaGiro && <p className="text-xs text-destructive">{errors.fechaGiro.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">URL Soporte (opcional)</label>
          <input type="url" {...register("urlSoporte")} className="w-full border rounded px-3 py-2 text-sm" placeholder="https://..." />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded disabled:opacity-50">
            {mutation.isPending ? "Confirmando..." : "Confirmar Giro"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
