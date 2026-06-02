import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { CargarCostosSchema, type CargarCostosFormValues } from '../schema'
import { useCargarCostosParafiscales } from '../hook'

const TIPO_NOMINA_OPTIONS = ['CATEDRATICOS', 'PLANTA', 'OCASIONAL', 'SUPERNUMERARIO']

interface Props {
  open:    boolean
  onClose: () => void
}

export function CargarParafiscalesDialog({ open, onClose }: Props) {
  const mutation = useCargarCostosParafiscales()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CargarCostosFormValues>({
    resolver: zodResolver(CargarCostosSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values)
    reset()
    onClose()
  })

  return (
    <Dialog open={open} onClose={onClose} title="Cargar Costos Parafiscales">
      <form onSubmit={onSubmit} className="space-y-4">

        <div className="grid grid-cols-3 gap-4">
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
          <FormField label="Tipo Nómina" error={errors.tipoNomina?.message}>
            <select className="input" {...register('tipoNomina')}>
              <option value="">Seleccionar…</option>
              {TIPO_NOMINA_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FormField>
        </div>

        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Porcentajes empleador (%)
        </p>
        <div className="grid grid-cols-3 gap-4">
          {([
            ['porcSaludEmpleador',   'Salud'],
            ['porcPensionEmpleador', 'Pensión'],
            ['porcArl',             'ARL'],
            ['porcCajaCompensacion','Caja Comp.'],
            ['porcIcbf',            'ICBF'],
            ['porcSena',            'SENA'],
          ] as const).map(([field, label]) => (
            <FormField key={field} label={label} error={errors[field]?.message}>
              <input
                type="number"
                step="0.01"
                className="input"
                {...register(field, { valueAsNumber: true })}
              />
            </FormField>
          ))}
        </div>

        <FormField label="Factor de Prestaciones" error={errors.factorPrestaciones?.message}>
          <input
            type="number"
            step="0.0001"
            className="input"
            {...register('factorPrestaciones', { valueAsNumber: true })}
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
            {isSubmitting ? 'Cargando…' : 'Cargar Costos'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
