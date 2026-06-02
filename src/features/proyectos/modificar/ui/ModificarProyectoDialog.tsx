import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ModificarProyectoSchema } from '../../model/schema'
import type { ModificarProyectoForm } from '../../model/schema'
import { useModificarProyecto } from '../hook'
import type { Proyecto } from '../../model/types'

interface Props {
  open: boolean
  proyecto: Proyecto
  onClose: () => void
}

export function ModificarProyectoDialog({ open, proyecto, onClose }: Props) {
  const modificar = useModificarProyecto(proyecto.id)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ModificarProyectoForm>({
    resolver: zodResolver(ModificarProyectoSchema),
    defaultValues: {
      Nombre:      proyecto.nombre,
      ValorTotal:  proyecto.valorTotal,
      FechaInicio: proyecto.fechaInicio,
      FechaFin:    proyecto.fechaFin,
    },
  })

  async function onSubmit(form: ModificarProyectoForm) {
    setServerError(null)
    try {
      await modificar.mutateAsync(form)
      reset()
      onClose()
    } catch (e: any) {
      setServerError(e?.message ?? 'Error al actualizar el proyecto')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Editar proyecto</h2>

        {serverError && (
          <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="text-sm font-medium">Nombre *</label>
            <input
              {...register('Nombre')}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.Nombre && <p className="text-xs text-destructive mt-1">{errors.Nombre.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Valor total *</label>
            <input
              {...register('ValorTotal', { valueAsNumber: true })}
              type="number" min={0} step="0.01"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.ValorTotal && <p className="text-xs text-destructive mt-1">{errors.ValorTotal.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Fecha inicio</label>
              <input {...register('FechaInicio')} type="date"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Fecha fin</label>
              <input {...register('FechaFin')} type="date"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              {errors.FechaFin && <p className="text-xs text-destructive mt-1">{errors.FechaFin.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { reset(); onClose() }}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted">Cancelar</button>
            <button type="submit" disabled={isSubmitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
