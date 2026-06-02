import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { useTenant } from '@/shared/hooks/useTenant'
import { useIniciarCierre } from '../hook'
import { iniciarCierreSchema } from '../../../model/schema'

type FormData = z.infer<typeof iniciarCierreSchema>

interface Props {
  open: boolean
  onClose: () => void
}

const currentYear = new Date().getFullYear()

export function IniciarCierreDialog({ open, onClose }: Props) {
  const { tenantActivo } = useTenant()
  const { mutate, isPending } = useIniciarCierre()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(iniciarCierreSchema),
    defaultValues: {
      vigencia: currentYear - 1,
      unidadEjecutoraId: tenantActivo?.id ?? 0,
    },
  })

  const onSubmit = (data: FormData) => {
    mutate(
      { ...data, observaciones: data.observaciones ?? null },
      { onSuccess: () => { reset(); onClose() } },
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Iniciar Cierre de Vigencia">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Vigencia a cerrar" error={errors.vigencia?.message} required>
          <input
            type="number"
            {...register('vigencia')}
            className="input"
            min={2000}
            max={currentYear}
          />
        </FormField>

        <FormField label="Observaciones" error={errors.observaciones?.message}>
          <textarea {...register('observaciones')} className="input" rows={3} />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? 'Iniciando...' : 'Iniciar cierre'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
