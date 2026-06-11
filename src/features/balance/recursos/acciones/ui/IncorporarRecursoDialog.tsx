import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput'
import { DatePickerField } from '@/shared/ui/forms/DatePickerField'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useIncorporarRecurso } from '../hook'
import { incorporarRecursoSchema } from '../../../model/schema'
import type { RecursoBalance } from '../../../model/types'

type FormData = z.infer<typeof incorporarRecursoSchema>
interface Props { recurso: RecursoBalance; open: boolean; onClose: () => void }

export function IncorporarRecursoDialog({ recurso, open, onClose }: Props) {
  const { mutate, isPending } = useIncorporarRecurso(recurso.id)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(incorporarRecursoSchema),
    defaultValues: { valorIncorporado: recurso.valorDisponible },
  })

  const onSubmit = (data: FormData) => {
    mutate({
      presupuestoIngresoId: data.presupuestoIngresoId,
      valorIncorporado: data.valorIncorporado,
      fechaIncorporacion: data.fechaIncorporacion,
      numeroAcuerdo: data.numeroAcuerdo,
      tipoActo: data.tipoActo,
      ...(data.urlActoAdministrativo ? { urlActoAdministrativo: data.urlActoAdministrativo } : {}),
    }, { onSuccess: () => { reset(); onClose() } })
  }

  return (
    <Dialog open={open} onClose={onClose} title="Incorporar Recurso de Balance">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

        <FormField label="Presupuesto Ingreso ID" error={errors.presupuestoIngresoId?.message} required>
          <Input type="number" {...register('presupuestoIngresoId')} />
        </FormField>

        <FormField label="Valor a incorporar" error={errors.valorIncorporado?.message} required>
          <Controller name="valorIncorporado" control={control} render={({ field }) => <CurrencyInput {...field} />} />
        </FormField>

        <FormField label="Fecha de incorporación" error={errors.fechaIncorporacion?.message} required>
          <Controller name="fechaIncorporacion" control={control} render={({ field }) => <DatePickerField {...field} />} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Número de acuerdo" error={errors.numeroAcuerdo?.message} required>
            <Input {...register('numeroAcuerdo')} />
          </FormField>
          <FormField label="Tipo de acto" error={errors.tipoActo?.message} required>
            <Input {...register('tipoActo')} />
          </FormField>
        </div>

        <FormField label="URL acto administrativo" error={errors.urlActoAdministrativo?.message}>
          <Input type="url" {...register('urlActoAdministrativo')} placeholder="https://..." />
        </FormField>

        <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isPending}>{isPending ? 'Incorporando...' : 'Incorporar'}</Button>
        </div>
      </form>
    </Dialog>
  )
}
