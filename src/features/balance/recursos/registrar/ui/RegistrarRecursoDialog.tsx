import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { SelectField } from '@/shared/ui/forms/SelectField'
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTenant } from '@/shared/hooks/useTenant'
import { useRegistrarRecurso } from '../hook'
import { registrarRecursoSchema } from '../../../model/schema'
import { TIPOS_RECURSO_BALANCE } from '../../../model/constants'

type FormData = z.infer<typeof registrarRecursoSchema>
interface Props { open: boolean; onClose: () => void }
const currentYear = new Date().getFullYear()

export function RegistrarRecursoDialog({ open, onClose }: Props) {
  const { tenantActivo } = useTenant()
  const { mutate, isPending } = useRegistrarRecurso()

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(registrarRecursoSchema),
    defaultValues: {
      unidadEjecutoraId: tenantActivo?.id ?? 0,
      vigenciaOrigen: currentYear - 1,
      vigenciaDestino: currentYear,
    },
  })

  const onSubmit = (data: FormData) => {
    mutate(
      {
        ...data,
        rubroOrigenId: data.rubroOrigenId ?? null,
        rubroOrigenDescripcion: data.rubroOrigenDescripcion ?? null,
        destinacionEspecifica: data.destinacionEspecifica ?? null,
      },
      { onSuccess: () => { reset(); onClose() } },
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Registrar Recurso de Balance">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Fuente de Recurso ID" error={errors.fuenteRecursoId?.message} required>
            <Input type="number" {...register('fuenteRecursoId')} />
          </FormField>
          <FormField label="Cierre de Vigencia ID" error={errors.cierreVigenciaId?.message} required>
            <Input type="number" {...register('cierreVigenciaId')} />
          </FormField>
        </div>

        <FormField label="Tipo" error={errors.tipo?.message} required>
          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <SelectField
                {...field}
                options={TIPOS_RECURSO_BALANCE.map((t: string) => ({ value: t, label: t.replace(/_/g, ' ') }))}
              />
            )}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Vigencia origen" error={errors.vigenciaOrigen?.message} required>
            <Input type="number" {...register('vigenciaOrigen')} min={2000} max={currentYear} />
          </FormField>
          <FormField label="Vigencia destino" error={errors.vigenciaDestino?.message} required>
            <Input type="number" {...register('vigenciaDestino')} min={2000} max={currentYear + 1} />
          </FormField>
        </div>

        <FormField label="Valor identificado" error={errors.valorIdentificado?.message} required>
          <Controller name="valorIdentificado" control={control} render={({ field }) => <CurrencyInput {...field} />} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Rubro origen ID" error={errors.rubroOrigenId?.message}>
            <Input type="number" {...register('rubroOrigenId')} />
          </FormField>
          <FormField label="Descripción rubro origen" error={errors.rubroOrigenDescripcion?.message}>
            <Input {...register('rubroOrigenDescripcion')} />
          </FormField>
        </div>

        <FormField label="Destinación específica" error={errors.destinacionEspecifica?.message}>
          <textarea
            {...register('destinacionEspecifica')}
            rows={2}
            className="w-full rounded-[12px] border border-[#d1d5db] bg-white px-3.5 py-2.5 text-sm text-[#1f2937] shadow-sm outline-none transition-all placeholder:text-[#6b7280] hover:border-[#004b82] focus:border-[#0a4f82] focus:ring-4 focus:ring-[#0a4f82]/12 resize-none"
          />
        </FormField>

        <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isPending}>{isPending ? 'Registrando...' : 'Registrar recurso'}</Button>
        </div>
      </form>
    </Dialog>
  )
}
