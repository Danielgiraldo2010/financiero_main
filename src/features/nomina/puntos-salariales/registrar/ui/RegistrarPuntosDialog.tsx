import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { DatePickerField } from '@/shared/ui/forms/DatePickerField'
import {
  RegistrarPuntosSchema,
  type RegistrarPuntosFormValues,
} from '../schema'
import { useRegistrarPuntosSalariales } from '../hook'

interface Props {
  open:    boolean
  onClose: () => void
}

export function RegistrarPuntosDialog({ open, onClose }: Props) {
  const mutation = useRegistrarPuntosSalariales()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrarPuntosFormValues>({
    resolver: zodResolver(RegistrarPuntosSchema),
    defaultValues: { vigenteHasta: null },
  })

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync({
      ...values,
      vigenteHasta: values.vigenteHasta ?? null,
    })
    reset()
    onClose()
  })

  return (
    <Dialog open={open} onClose={onClose} title="Registrar Puntos Salariales">
      <form onSubmit={onSubmit} className="space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Vigencia" error={errors.vigencia?.message}>
            <input
              type="number"
              className="input"
              {...register('vigencia', { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Categoría" error={errors.categoria?.message}>
            <input type="text" className="input" {...register('categoria')} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Decreto / Norma" error={errors.decretoNorma?.message}>
            <input type="text" className="input" {...register('decretoNorma')} />
          </FormField>

          <FormField label="Nivel" error={errors.nivel?.message}>
            <input
              type="number"
              className="input"
              {...register('nivel', { valueAsNumber: true })}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField label="Puntos Base" error={errors.puntosBase?.message}>
            <input
              type="number"
              step="0.01"
              className="input"
              {...register('puntosBase', { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Valor Punto ($)" error={errors.valorPunto?.message}>
            <input
              type="number"
              step="0.01"
              className="input"
              {...register('valorPunto', { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Factor Categoría" error={errors.factorCategoria?.message}>
            <input
              type="number"
              step="0.0001"
              className="input"
              {...register('factorCategoria', { valueAsNumber: true })}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="vigenteDesde"
            render={({ field, fieldState }) => (
              <DatePickerField
                label="Vigente Desde"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="vigenteHasta"
            render={({ field, fieldState }) => (
              <DatePickerField
                label="Vigente Hasta (opcional)"
                value={field.value ?? ''}
                onChange={(v) => field.onChange(v || null)}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

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
