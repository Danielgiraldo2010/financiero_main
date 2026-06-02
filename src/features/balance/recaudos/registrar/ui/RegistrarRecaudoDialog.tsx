import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { SelectField } from '@/shared/ui/forms/SelectField'
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput'
import { DatePickerField } from '@/shared/ui/forms/DatePickerField'
import { useRegistrarRecaudo } from '../hook'
import { registrarRecaudoSchema } from '../../../model/schema'
import { TIPOS_ENTIDAD } from '../../../model/constants'

type FormData = z.infer<typeof registrarRecaudoSchema>

interface Props { open: boolean; onClose: () => void }

const currentYear = new Date().getFullYear()

export function RegistrarRecaudoDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useRegistrarRecaudo()

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(registrarRecaudoSchema),
    defaultValues: { vigencia: currentYear, tipoEntidad: 'NACION' },
  })

  const onSubmit = (data: FormData) => {
    mutate(
      {
        ...data,
        numeroResolucion: data.numeroResolucion ?? null,
        urlSoporte: data.urlSoporte ?? null,
      },
      { onSuccess: () => { reset(); onClose() } },
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Registrar Recaudo Real">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Vigencia" error={errors.vigencia?.message} required>
            <input type="number" {...register('vigencia')} className="input" />
          </FormField>
          <FormField label="Periodo (mes)" error={errors.periodo?.message} required>
            <input type="number" {...register('periodo')} className="input" min={1} max={12} />
          </FormField>
        </div>

        <FormField label="Presupuesto Ingreso ID" error={errors.presupuestoIngresoId?.message} required>
          <input type="number" {...register('presupuestoIngresoId')} className="input" />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Fecha de giro" error={errors.fechaGiro?.message} required>
            <Controller
              name="fechaGiro"
              control={control}
              render={({ field }) => <DatePickerField {...field} />}
            />
          </FormField>
          <FormField label="Numero de giro" error={errors.numeroGiro?.message} required>
            <input {...register('numeroGiro')} className="input" />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Entidad pagadora" error={errors.entidadPagadora?.message} required>
            <input {...register('entidadPagadora')} className="input" />
          </FormField>
          <FormField label="Tipo de entidad" error={errors.tipoEntidad?.message} required>
            <Controller
              name="tipoEntidad"
              control={control}
              render={({ field }) => (
                <SelectField
                  {...field}
                  options={TIPOS_ENTIDAD.map((t: string) => ({ value: t, label: t }))}
                />
              )}
            />
          </FormField>
        </div>

        <FormField label="Concepto" error={errors.concepto?.message} required>
          <input {...register('concepto')} className="input" />
        </FormField>

        <FormField label="Valor" error={errors.valor?.message} required>
          <Controller
            name="valor"
            control={control}
            render={({ field }) => <CurrencyInput {...field} />}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Numero resolucion" error={errors.numeroResolucion?.message}>
            <input {...register('numeroResolucion')} className="input" />
          </FormField>
          <FormField label="URL soporte" error={errors.urlSoporte?.message}>
            <input type="url" {...register('urlSoporte')} className="input" />
          </FormField>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? 'Registrando...' : 'Registrar recaudo'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
