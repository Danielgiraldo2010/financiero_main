import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTenant } from '@/shared/hooks/useTenant'
import { useIniciarCierre } from '../hook'
import { iniciarCierreSchema } from '../../../model/schema'

type FormData = z.infer<typeof iniciarCierreSchema>
interface Props { open: boolean; onClose: () => void }
const currentYear = new Date().getFullYear()

export function IniciarCierreDialog({ open, onClose }: Props) {
  const { tenantActivo } = useTenant()
  const { mutate, isPending } = useIniciarCierre()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(iniciarCierreSchema),
    defaultValues: { vigencia: currentYear - 1, unidadEjecutoraId: tenantActivo?.id ?? 0 },
  })

  const onSubmit = (data: FormData) => {
    mutate({ ...data, observaciones: data.observaciones ?? null }, { onSuccess: () => { reset(); onClose() } })
  }

  return (
    <Dialog open={open} onClose={onClose} title="Iniciar Cierre de Vigencia">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
        <FormField label="Vigencia a cerrar" error={errors.vigencia?.message} required>
          <Input type="number" {...register('vigencia')} min={2000} max={currentYear} />
        </FormField>
        <FormField label="Observaciones" error={errors.observaciones?.message}>
          <textarea
            {...register('observaciones')}
            rows={3}
            className="w-full rounded-[12px] border border-[#d1d5db] bg-white px-3.5 py-2.5 text-sm text-[#1f2937] shadow-sm outline-none transition-all placeholder:text-[#6b7280] hover:border-[#004b82] focus:border-[#0a4f82] focus:ring-4 focus:ring-[#0a4f82]/12 resize-none"
          />
        </FormField>
        <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isPending}>{isPending ? 'Iniciando...' : 'Iniciar cierre'}</Button>
        </div>
      </form>
    </Dialog>
  )
}
