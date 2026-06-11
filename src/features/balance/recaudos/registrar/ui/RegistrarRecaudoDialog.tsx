import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { SelectField } from '@/shared/ui/forms/SelectField'
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput'
import { DatePickerField } from '@/shared/ui/forms/DatePickerField'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
      { ...data, numeroResolucion: data.numeroResolucion ?? null, urlSoporte: data.urlSoporte ?? null },
      { onSuccess: () => { reset(); onClose() } },
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Registrar Recaudo Real">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Vigencia" error={errors.vigencia?.message} required>
            <Input type="number" {...register('vigencia')} min={2000} max={currentYear + 1} />
          </FormField>
          <FormField label="Periodo (mes)" error={errors.periodo?.message} required>
            <Input type="number" {...register('periodo')} min={1} max={12} />
          </FormField>
        </div>

        <FormField label="Presupuesto Ingreso ID" error={errors.presupuestoIngresoId?.message} required>
          <Input type="number" {...register('presupuestoIngresoId')} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Fecha de giro" error={errors.fechaGiro?.message} required>
            <Controller name="fechaGiro" control={control} render={({ field }) => <DatePickerField {...field} />} />
          </FormField>
          <FormField label="Número de giro" error={errors.numeroGiro?.message} required>
            <Input {...register('numeroGiro')} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Entidad pagadora" error={errors.entidadPagadora?.message} required>
            <Input {...register('entidadPagadora')} />
          </FormField>
          <FormField label="Tipo de entidad" error={errors.tipoEntidad?.message} required>
            <Controller
              name="tipoEntidad"
              control={control}
              render={({ field }) => (
                <SelectField {...field} options={TIPOS_ENTIDAD.map((t: string) => ({ value: t, label: t }))} />
              )}
            />
          </FormField>
        </div>

        <FormField label="Concepto" error={errors.concepto?.message} required>
          <Input {...register('concepto')} />
        </FormField>

        <FormField label="Valor" error={errors.valor?.message} required>
          <Controller name="valor" control={control} render={({ field }) => <CurrencyInput {...field} />} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Número resolución" error={errors.numeroResolucion?.message}>
            <Input {...register('numeroResolucion')} />
          </FormField>
          <FormField label="URL soporte" error={errors.urlSoporte?.message}>
            <Input type="url" {...register('urlSoporte')} placeholder="https://..." />
          </FormField>
        </div>

        <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isPending}>{isPending ? 'Registrando...' : 'Registrar recaudo'}</Button>
        </div>
      </form>
    </Dialog>
  )
}
