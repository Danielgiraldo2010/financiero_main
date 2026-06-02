import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { SelectField } from '@/shared/ui/forms/SelectField'
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput'
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Fuente de Recurso ID" error={errors.fuenteRecursoId?.message} required>
          <input type="number" {...register('fuenteRecursoId')} className="input" />
        </FormField>

        <FormField label="Cierre de Vigencia ID" error={errors.cierreVigenciaId?.message} required>
          <input type="number" {...register('cierreVigenciaId')} className="input" />
        </FormField>

        <FormField label="Tipo" error={errors.tipo?.message} required>
          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <SelectField
                {...field}
                options={TIPOS_RECURSO_BALANCE.map((t: string) => ({
                  value: t,
                  label: t.replace(/_/g, ' '),
                }))}
              />
            )}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Vigencia origen" error={errors.vigenciaOrigen?.message} required>
            <input type="number" {...register('vigenciaOrigen')} className="input" />
          </FormField>
          <FormField label="Vigencia destino" error={errors.vigenciaDestino?.message} required>
            <input type="number" {...register('vigenciaDestino')} className="input" />
          </FormField>
        </div>

        <FormField label="Valor identificado" error={errors.valorIdentificado?.message} required>
          <Controller
            name="valorIdentificado"
            control={control}
            render={({ field }) => <CurrencyInput {...field} />}
          />
        </FormField>

        <FormField label="Rubro origen ID" error={errors.rubroOrigenId?.message}>
          <input type="number" {...register('rubroOrigenId')} className="input" />
        </FormField>

        <FormField label="Descripcion rubro origen" error={errors.rubroOrigenDescripcion?.message}>
          <input {...register('rubroOrigenDescripcion')} className="input" />
        </FormField>

        <FormField label="Destinacion especifica" error={errors.destinacionEspecifica?.message}>
          <textarea {...register('destinacionEspecifica')} className="input" rows={2} />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? 'Registrando...' : 'Registrar recurso'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
