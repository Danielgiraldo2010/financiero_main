import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput'
import { DatePickerField } from '@/shared/ui/forms/DatePickerField'
import { useRegistrarConciliacion } from '../hook'
import { registrarConciliacionSchema } from '../../../model/schema'

type FormData = z.infer<typeof registrarConciliacionSchema>

interface Props { open: boolean; onClose: () => void }

export function IniciarConciliacionDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useRegistrarConciliacion()

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(registrarConciliacionSchema),
  })

  const onSubmit = (data: FormData) => {
    mutate(
      { ...data, urlSoporte: data.urlSoporte ?? null },
      { onSuccess: () => { reset(); onClose() } },
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Registrar Conciliacion de Balance">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Recurso Balance ID" error={errors.recursoBalanceId?.message} required>
          <input type="number" {...register('recursoBalanceId')} className="input" />
        </FormField>

        <FormField label="Fecha de corte" error={errors.fechaCorte?.message} required>
          <Controller
            name="fechaCorte"
            control={control}
            render={({ field }) => <DatePickerField {...field} />}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Valor en sistema" error={errors.valorSistema?.message} required>
            <Controller
              name="valorSistema"
              control={control}
              render={({ field }) => <CurrencyInput {...field} />}
            />
          </FormField>
          <FormField label="Valor en tesoreria" error={errors.valorTesoreria?.message} required>
            <Controller
              name="valorTesoreria"
              control={control}
              render={({ field }) => <CurrencyInput {...field} />}
            />
          </FormField>
        </div>

        <FormField label="URL soporte" error={errors.urlSoporte?.message}>
          <input type="url" {...register('urlSoporte')} className="input" />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? 'Registrando...' : 'Registrar conciliacion'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
