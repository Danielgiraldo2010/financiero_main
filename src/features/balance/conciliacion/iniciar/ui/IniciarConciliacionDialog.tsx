import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput'
import { DatePickerField } from '@/shared/ui/forms/DatePickerField'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
    <Dialog open={open} onClose={onClose} title="Registrar Conciliación de Balance">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

        <FormField label="Recurso Balance ID" error={errors.recursoBalanceId?.message} required>
          <Input type="number" {...register('recursoBalanceId')} />
        </FormField>

        <FormField label="Fecha de corte" error={errors.fechaCorte?.message} required>
          <Controller
            name="fechaCorte"
            control={control}
            render={({ field }) => <DatePickerField {...field} />}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Valor en sistema" error={errors.valorSistema?.message} required>
            <Controller
              name="valorSistema"
              control={control}
              render={({ field }) => <CurrencyInput {...field} />}
            />
          </FormField>
          <FormField label="Valor en tesorería" error={errors.valorTesoreria?.message} required>
            <Controller
              name="valorTesoreria"
              control={control}
              render={({ field }) => <CurrencyInput {...field} />}
            />
          </FormField>
        </div>

        <FormField label="URL soporte" error={errors.urlSoporte?.message}>
          <Input type="url" {...register('urlSoporte')} placeholder="https://..." />
        </FormField>

        <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Registrando...' : 'Registrar conciliación'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
