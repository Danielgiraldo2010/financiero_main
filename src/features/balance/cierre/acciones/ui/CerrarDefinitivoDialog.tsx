import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { useCerrarDefinitivo } from '../hook'
import { cerrarDefinitivoSchema } from '../../../model/schema'

type FormData = z.infer<typeof cerrarDefinitivoSchema>

interface Props {
  cierreId: number
  vigencia: number
  open: boolean
  onClose: () => void
}

// FE10-I1: Cerrar vigencia es IRREVERSIBLE — usuario debe escribir el anno para confirmar
export function CerrarDefinitivoDialog({ cierreId, vigencia, open, onClose }: Props) {
  const { mutate, isPending } = useCerrarDefinitivo(cierreId)

  const schema = cerrarDefinitivoSchema.refine(
    (data: { vigenciaConfirmacion: string }) => data.vigenciaConfirmacion === String(vigencia),
    { message: `Escriba exactamente "${vigencia}" para confirmar`, path: ['vigenciaConfirmacion'] },
  )

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    mutate({ id: cierreId, urlActaCierre: data.urlActaCierre }, {
      onSuccess: () => { reset(); onClose() },
    })
  }

  return (
    <Dialog open={open} onClose={onClose} title="Cierre Definitivo de Vigencia">
      <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3">
        <p className="text-sm font-semibold text-red-700">Accion irreversible</p>
        <p className="text-sm text-red-600 mt-1">
          Esta accion cerrara definitivamente la vigencia <strong>{vigencia}</strong> y
          no podra deshacerse. Asegurese de que todos los procesos esten finalizados.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label={`Confirmar vigencia — escriba "${vigencia}"`}
          error={errors.vigenciaConfirmacion?.message}
          required
        >
          <input
            {...register('vigenciaConfirmacion')}
            className="input font-mono"
            placeholder={String(vigencia)}
            autoComplete="off"
          />
        </FormField>

        <FormField label="URL del Acta de Cierre" error={errors.urlActaCierre?.message} required>
          <input
            {...register('urlActaCierre')}
            type="url"
            className="input"
            placeholder="https://..."
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? 'Cerrando...' : 'Cerrar vigencia definitivamente'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
