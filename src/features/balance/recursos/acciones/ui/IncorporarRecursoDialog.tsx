import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput'
import { DatePickerField } from '@/shared/ui/forms/DatePickerField'
import { useIncorporarRecurso } from '../hook'
import { incorporarRecursoSchema } from '../../../model/schema'
import type { RecursoBalance } from '../../../model/types'

type FormData = z.infer<typeof incorporarRecursoSchema>

interface Props {
  recurso: RecursoBalance
  open: boolean
  onClose: () => void
}

// FE10-I3: Solo se muestra si recurso.estado === 'VALIDADO'
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Presupuesto Ingreso ID" error={errors.presupuestoIngresoId?.message} required>
          <input type="number" {...register('presupuestoIngresoId')} className="input" />
        </FormField>

        <FormField label="Valor a incorporar" error={errors.valorIncorporado?.message} required>
          <Controller
            name="valorIncorporado"
            control={control}
            render={({ field }) => <CurrencyInput {...field} />}
          />
        </FormField>

        <FormField label="Fecha de incorporacion" error={errors.fechaIncorporacion?.message} required>
          <Controller
            name="fechaIncorporacion"
            control={control}
            render={({ field }) => <DatePickerField {...field} />}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Numero de acuerdo" error={errors.numeroAcuerdo?.message} required>
            <input {...register('numeroAcuerdo')} className="input" />
          </FormField>
          <FormField label="Tipo de acto" error={errors.tipoActo?.message} required>
            <input {...register('tipoActo')} className="input" />
          </FormField>
        </div>

        <FormField label="URL acto administrativo" error={errors.urlActoAdministrativo?.message}>
          <input type="url" {...register('urlActoAdministrativo')} className="input" />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? 'Incorporando...' : 'Incorporar'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
