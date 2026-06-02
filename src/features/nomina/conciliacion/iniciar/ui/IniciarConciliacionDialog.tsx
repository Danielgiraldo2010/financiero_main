import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { useTenant } from '@/shared/hooks/useTenant'
import { IniciarConciliacionSchema, type IniciarConciliacionFormValues } from '../schema'
import { useIniciarConciliacion } from '../hook'
import type { ConciliacionNomina } from '../api'

interface Props {
  open:      boolean
  onClose:   () => void
  onSuccess: (resultado: ConciliacionNomina) => void
}

export function IniciarConciliacionDialog({ open, onClose, onSuccess }: Props) {
  const mutation = useIniciarConciliacion()
  const { tenantActivo } = useTenant()
const unidadEjecutoraId = tenantActivo?.id ?? 0

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IniciarConciliacionFormValues>({
    resolver: zodResolver(IniciarConciliacionSchema),
    defaultValues: { unidadEjecutoraId },
  })

  const onSubmit = handleSubmit(async (values) => {
    const resultado = await mutation.mutateAsync(values)
    reset()
    onSuccess(resultado)
  })

  return (
    <Dialog open={open} onClose={onClose} title="Iniciar Conciliación de Nómina">
      <form onSubmit={onSubmit} className="space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Vigencia" error={errors.vigencia?.message}>
            <input
              type="number"
              className="input"
              {...register('vigencia', { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Mes" error={errors.mes?.message}>
            <input
              type="number"
              min={1} max={12}
              className="input"
              {...register('mes', { valueAsNumber: true })}
            />
          </FormField>
        </div>

        <FormField label="ID Proyecto" error={errors.proyectoId?.message}>
          <input
            type="number"
            className="input"
            {...register('proyectoId', { valueAsNumber: true })}
          />
        </FormField>

        {mutation.error && (
          <p className="text-sm text-red-600">
            {(mutation.error as Error).message}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Procesando…' : 'Iniciar Conciliación'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
