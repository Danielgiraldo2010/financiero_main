import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { DatePickerField } from '@/shared/ui/forms/DatePickerField'
import { ConfirmarPagoSchema, type ConfirmarPagoFormValues } from '../schema'
import { useConfirmarPagoNomina } from '../hook'

interface Props {
  nominaEmpleadoId: number
  empleadoNombre:   string
  totalNeto:        number
  open:             boolean
  onClose:          () => void
}

export function ConfirmarPagoDialog({
  nominaEmpleadoId,
  empleadoNombre,
  totalNeto,
  open,
  onClose,
}: Props) {
  const mutation = useConfirmarPagoNomina()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConfirmarPagoFormValues>({
    resolver: zodResolver(ConfirmarPagoSchema),
    defaultValues: {
      comprobantePago: null,
      urlSoporte:      null,
      ordenPagoId:     null,
      observaciones:   null,
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync({
      nominaEmpleadoId,
      payload: {
        nominaEmpleadoId,
        fechaPago:       values.fechaPago,
        comprobantePago: values.comprobantePago ?? null,
        urlSoporte:      values.urlSoporte      ?? null,
        ordenPagoId:     values.ordenPagoId     ?? null,
        observaciones:   values.observaciones   ?? null,
      },
    })
    reset()
    onClose()
  })

  const isRunning = mutation.isPending

  return (
    <Dialog open={open} onClose={onClose} title="Confirmar Pago de Nómina">
      <div className="space-y-4">
        {/* 07c-I6: advertencia irreversible */}
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm font-medium text-amber-800">
            ⚠ Esta acción no se puede deshacer
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Confirmando el pago a <span className="font-semibold">{empleadoNombre}</span>{' '}
            por valor de{' '}
            <span className="font-semibold">
              {totalNeto.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}
            </span>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Controller
            control={control}
            name="fechaPago"
            render={({ field, fieldState }) => (
              <DatePickerField
                label="Fecha de Pago"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Comprobante de Pago" error={errors.comprobantePago?.message}>
              <input type="text" className="input" {...register('comprobantePago')} />
            </FormField>
            <FormField label="Orden de Pago ID" error={errors.ordenPagoId?.message}>
              <input
                type="number"
                className="input"
                {...register('ordenPagoId', { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <FormField label="URL Soporte" error={errors.urlSoporte?.message}>
            <input type="url" className="input" {...register('urlSoporte')} />
          </FormField>

          <FormField label="Observaciones" error={errors.observaciones?.message}>
            <textarea className="input" rows={2} {...register('observaciones')} />
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
              disabled={isRunning}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isRunning}>
              {isRunning ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Procesando…
                </span>
              ) : (
                'Confirmar Pago'
              )}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
