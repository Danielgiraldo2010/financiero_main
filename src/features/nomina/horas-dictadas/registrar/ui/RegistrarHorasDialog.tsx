import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { RegistrarHorasSchema, type RegistrarHorasFormValues } from '../schema'
import { useRegistrarHorasDictadas } from '../hook'

const MES_OPTIONS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

interface Props {
  planClasesId: number
  open:         boolean
  onClose:      () => void
}

export function RegistrarHorasDialog({ planClasesId, open, onClose }: Props) {
  const mutation = useRegistrarHorasDictadas()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrarHorasFormValues>({
    resolver: zodResolver(RegistrarHorasSchema),
    defaultValues: {
      planClasesId,
      justificacion: null,
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync({
      ...values,
      justificacion: values.justificacion ?? null,
    })
    reset({ planClasesId, justificacion: null })
    onClose()
  })

  return (
    <Dialog open={open} onClose={onClose} title="Registrar Horas Dictadas">
      <form onSubmit={onSubmit} className="space-y-4">

        <FormField label="Mes" error={errors.mes?.message}>
          <select className="input" {...register('mes', { valueAsNumber: true })}>
            <option value="">Seleccionar mes</option>
            {MES_OPTIONS.map((nombre, i) => (
              <option key={i + 1} value={i + 1}>
                {nombre}
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Horas Proyectadas" error={errors.horasProyectadas?.message}>
            <input
              type="number"
              step="0.5"
              className="input"
              {...register('horasProyectadas', { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Horas Reales" error={errors.horasReales?.message}>
            <input
              type="number"
              step="0.5"
              className="input"
              {...register('horasReales', { valueAsNumber: true })}
            />
          </FormField>
        </div>

        <FormField label="Justificación" error={errors.justificacion?.message}>
          <textarea
            className="input"
            rows={2}
            {...register('justificacion')}
            placeholder="Requerida si existen diferencias"
          />
        </FormField>

        {mutation.error && (
          <p className="text-sm text-red-600">
            {(mutation.error as Error).message}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Registrar'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
