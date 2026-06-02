import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { useAprobarCierre } from '../hook'
import { aprobarCierreSchema } from '../../../model/schema'

type FormData = z.infer<typeof aprobarCierreSchema>

interface Props {
  cierreId: number
  open: boolean
  onClose: () => void
}

export function AprobarCierreDialog({ cierreId, open, onClose }: Props) {
  const { mutate, isPending } = useAprobarCierre(cierreId)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(aprobarCierreSchema),
  })

  const onSubmit = (data: FormData) => {
    mutate({ id: cierreId, observaciones: data.observaciones }, {
      onSuccess: () => { reset(); onClose() },
    })
  }

  return (
    <Dialog open={open} onClose={onClose} title="Aprobar Cierre de Vigencia">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Observaciones de aprobacion" error={errors.observaciones?.message} required>
          <textarea
            {...register('observaciones')}
            className="input"
            rows={4}
            placeholder="Describa las observaciones de la aprobacion (minimo 10 caracteres)..."
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? 'Aprobando...' : 'Aprobar cierre'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
