// src\features\proyectos\registrar\ui\RegistrarProyectoDialog.tsx
import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegistrarProyectoSchema } from '../../model/schema'
import type { RegistrarProyectoForm } from '../../model/schema'
import { useRegistrarProyecto, useListarTiposProyecto } from '../hook'
import { useVigencia } from '@/shared/hooks/useVigencia'
import { CATEGORIA_PROYECTO_LABEL } from '../../model/constants'
import type { CategoriaProyecto } from '../../model/types'

interface Props {
  open:                boolean
  onClose:             () => void
  unidadesEjecutoras:  Array<{ id: number; nombre: string }>
  programasAcademicos: Array<{ id: number; nombre: string }>
}

export function RegistrarProyectoDialog({
  open,
  onClose,
  unidadesEjecutoras,
  programasAcademicos,
}: Props) {
  const { vigenciaActiva: vigencia } = useVigencia()
  const registrar = useRegistrarProyecto()

  // Carga tipos desde el backend — no viene como prop
  const { data: tiposProyecto = [], isLoading: cargandoTipos } =
    useListarTiposProyecto({ estado: 'ACTIVO' })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrarProyectoForm>({
    resolver:      zodResolver(RegistrarProyectoSchema),
    defaultValues: { VigenciaActiva: vigencia },
  })

  const tipoSeleccionadoId = watch('TipoProyectoId')
  const tipoSeleccionado   = tiposProyecto.find((t) => t.id === Number(tipoSeleccionadoId))
  const requierePrograma   = tipoSeleccionado?.habilitaMatriculas     ?? false
  const requiereDnp        = tipoSeleccionado?.requiereInscripcionDnp ?? false

  // Sincronizar _habilitaMatriculas con useEffect (no en render)
  useEffect(() => {
    setValue(
      '_habilitaMatriculas',
      tipoSeleccionado?.habilitaMatriculas ?? false,
      { shouldValidate: false }
    )
    // Limpiar programa si el tipo ya no lo requiere
    if (!tipoSeleccionado?.habilitaMatriculas) {
      setValue('ProgramaAcademicoId', undefined, { shouldValidate: false })
    }
  }, [tipoSeleccionado, setValue])

  const onSubmit: SubmitHandler<RegistrarProyectoForm> = async (form) => {
    const { _habilitaMatriculas: _, ...payload } = form
    await registrar.mutateAsync(payload as any)
    reset()
    onClose()
  }

  if (!open) return null

  // Agrupar tipos por categoría para <optgroup>
  const tiposPorCategoria = tiposProyecto.reduce<
    Partial<Record<CategoriaProyecto, typeof tiposProyecto>>
  >((acc, t) => {
    if (!acc[t.categoria]) acc[t.categoria] = []
    acc[t.categoria]!.push(t)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-background p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Registrar proyecto especial</h2>

        {registrar.error && (
          <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {registrar.error.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

          {/* Código + Vigencia */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Código *</label>
              <input
                {...register('Codigo')}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="PE-2025-001"
              />
              {errors.Codigo && (
                <p className="text-xs text-destructive mt-1">{errors.Codigo.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Vigencia *</label>
              <input
                {...register('VigenciaActiva', { valueAsNumber: true })}
                type="number"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {errors.VigenciaActiva && (
                <p className="text-xs text-destructive mt-1">{errors.VigenciaActiva.message}</p>
              )}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="text-sm font-medium">Nombre *</label>
            <input
              {...register('Nombre')}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.Nombre && (
              <p className="text-xs text-destructive mt-1">{errors.Nombre.message}</p>
            )}
          </div>

          {/* UE + Tipo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Unidad ejecutora *</label>
              <select
                {...register('UnidadEjecutoraId', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar…</option>
                {unidadesEjecutoras.map((ue) => (
                  <option key={ue.id} value={ue.id}>{ue.nombre}</option>
                ))}
              </select>
              {errors.UnidadEjecutoraId && (
                <p className="text-xs text-destructive mt-1">{errors.UnidadEjecutoraId.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Tipo de proyecto *</label>
              <select
                {...register('TipoProyectoId', { valueAsNumber: true })}
                disabled={cargandoTipos}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
              >
                <option value="">
                  {cargandoTipos ? 'Cargando…' : 'Seleccionar…'}
                </option>
                {(Object.keys(tiposPorCategoria) as CategoriaProyecto[]).map((cat) => (
                  <optgroup key={cat} label={CATEGORIA_PROYECTO_LABEL[cat]}>
                    {tiposPorCategoria[cat]!.map((t) => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.TipoProyectoId && (
                <p className="text-xs text-destructive mt-1">{errors.TipoProyectoId.message}</p>
              )}
            </div>
          </div>

          {/* Panel informativo del tipo seleccionado */}
          {tipoSeleccionado && (
            <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground space-y-0.5">
              <p>
                <span className="font-medium">Categoría:</span>{' '}
                {CATEGORIA_PROYECTO_LABEL[tipoSeleccionado.categoria]}
              </p>
              {tipoSeleccionado.habilitaMatriculas         && <p>✓ Habilita matrículas</p>}
              {tipoSeleccionado.habilitaNominaCatedratico   && <p>✓ Habilita nómina catedráticos</p>}
              {tipoSeleccionado.habilitaSar                 && <p>✓ Habilita SAR / Viáticos</p>}
              {tipoSeleccionado.afectaHorasDocente          && <p>✓ Afecta horas descarga docente</p>}
              {tipoSeleccionado.porcentajeTransferencia != null &&
                tipoSeleccionado.porcentajeTransferencia > 0 && (
                <p>↗ Transferencia nivel central: {tipoSeleccionado.porcentajeTransferencia}%</p>
              )}
            </div>
          )}

          {/* Aviso DNP */}
          {requiereDnp && (
            <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
              ⚠ Este tipo requiere inscripción previa en el DNP antes de registrar el proyecto.
            </div>
          )}

          {/* Programa académico — solo si el tipo lo requiere */}
          {requierePrograma && (
            <div>
              <label className="text-sm font-medium">Programa académico *</label>
              <select
                {...register('ProgramaAcademicoId', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar…</option>
                {programasAcademicos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              {errors.ProgramaAcademicoId && (
                <p className="text-xs text-destructive mt-1">{errors.ProgramaAcademicoId.message}</p>
              )}
            </div>
          )}

          {/* Valor total */}
          <div>
            <label className="text-sm font-medium">Valor total *</label>
            <input
              {...register('ValorTotal', { valueAsNumber: true })}
              type="number" min={0} step="0.01"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.ValorTotal && (
              <p className="text-xs text-destructive mt-1">{errors.ValorTotal.message}</p>
            )}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Fecha inicio</label>
              <input
                {...register('FechaInicio')}
                type="date"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Fecha fin</label>
              <input
                {...register('FechaFin')}
                type="date"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {errors.FechaFin && (
                <p className="text-xs text-destructive mt-1">{errors.FechaFin.message}</p>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { reset(); onClose() }}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || cargandoTipos}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Registrando…' : 'Registrar proyecto'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
