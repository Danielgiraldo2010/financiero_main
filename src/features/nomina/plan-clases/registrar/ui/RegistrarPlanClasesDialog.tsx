import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { SelectField } from '@/shared/ui/forms/SelectField'
import { SearchableSelect } from '@/shared/ui/forms/SearchableSelect'
import { formatCOP } from '@/shared/lib/currency'
import { useEmpleados } from '../../../empleados/listar/hook'
import { usePuntosSalariales } from '../../../puntos-salariales/listar/hook'
import { TIPOS_EMPLEADO_PLAN_CLASES } from '../../../model/constants'
import {
  RegistrarPlanClasesSchema,
  type RegistrarPlanClasesFormValues,
} from '../schema'
import { useRegistrarPlanClases } from '../hook'

const NORMA_OPTIONS = [
  { value: 'GENERAL',           label: 'General' },
  { value: 'ACUERDO_44_2017',   label: 'Acuerdo 44 de 2017' },
  { value: 'DECRETO_1065_1968', label: 'Decreto 1065 de 1968' },
]

// Sentinel para "sin asignar" — evita null en SelectField
const SIN_ASIGNAR = 0

interface Props {
  open:    boolean
  onClose: () => void
}

export function RegistrarPlanClasesDialog({ open, onClose }: Props) {
  const mutation = useRegistrarPlanClases()

  // empleadosData es PagedResult<Empleado>
  const { data: empleadosData } = useEmpleados()
  const empleadosFiltrados = (empleadosData?.items ?? []).filter((e) =>
    (TIPOS_EMPLEADO_PLAN_CLASES as readonly string[]).includes(e.tipoEmpleado)
  )

  // puntosData es PuntoSalarial[] — array directo, sin .items
  const { data: puntosData } = usePuntosSalariales()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrarPlanClasesFormValues>({
    resolver: zodResolver(RegistrarPlanClasesSchema),
    defaultValues: {
      codigoAsignatura:   null,
      grupo:              null,
      puntosSalarialesId: null,
      observaciones:      null,
    },
  })

  const horasSemanales     = useWatch({ control, name: 'horasSemanales' })
  const semanas            = useWatch({ control, name: 'semanas' })
  const puntosSalarialesId = useWatch({ control, name: 'puntosSalarialesId' })

  // puntosData es array directo — .find() sin .items
  const puntosSeleccionado = puntosData?.find(
    (p) => p.id === puntosSalarialesId
  )

  const horasTotal        = (horasSemanales ?? 0) * (semanas ?? 0)
  const valorHoraEstimado = puntosSeleccionado?.valorHoraCatedraPregrado ?? 0
  const costoEstimado     = horasTotal * valorHoraEstimado

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync({
      ...values,
      codigoAsignatura:   values.codigoAsignatura   ?? null,
      grupo:              values.grupo              ?? null,
      puntosSalarialesId: values.puntosSalarialesId ?? null,
      observaciones:      values.observaciones      ?? null,
    })
    reset()
    onClose()
  })

  const empleadoOptions = empleadosFiltrados.map((e) => ({
    value: e.id,
    label: `${e.nombreCompleto} — ${e.numeroIdentificacion}`,
  }))

  // SIN_ASIGNAR (0) como sentinel en lugar de null
  const puntosOptions = [
    { value: SIN_ASIGNAR, label: '— Sin asignar —' },
    ...(puntosData ?? []).map((p) => ({
      value: p.id,
      label: `${p.vigencia} · ${p.categoria} Niv.${p.nivel} · ${p.decretoNorma}`,
    })),
  ]

  return (
    <Dialog open={open} onClose={onClose} title="Registrar Plan de Clases">
      <form onSubmit={onSubmit} className="space-y-4">

        {/* Empleado */}
        <Controller
          control={control}
          name="empleadoId"
          render={({ field, fieldState }) => (
            <SearchableSelect
              label="Empleado"
              options={empleadoOptions}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              placeholder="Buscar empleado…"
            />
          )}
        />

        {/* Período + Programa */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="ID Período Académico" error={errors.periodoAcademicoId?.message}>
            <input
              type="number"
              className="input"
              {...register('periodoAcademicoId', { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="ID Programa Académico" error={errors.programaAcademicoId?.message}>
            <input
              type="number"
              className="input"
              {...register('programaAcademicoId', { valueAsNumber: true })}
            />
          </FormField>
        </div>

        {/* Asignatura */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Asignatura" error={errors.asignatura?.message}>
            <input type="text" className="input" {...register('asignatura')} />
          </FormField>
          <FormField label="Código Asignatura" error={errors.codigoAsignatura?.message}>
            <input type="text" className="input" {...register('codigoAsignatura')} />
          </FormField>
        </div>

        {/* Grupo + Norma */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Grupo" error={errors.grupo?.message}>
            <input type="text" className="input" {...register('grupo')} />
          </FormField>
          <Controller
            control={control}
            name="normaLiquidacion"
            render={({ field, fieldState }) => (
              <SelectField
                label="Norma Liquidación"
                options={NORMA_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Horas + Semanas */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Horas Semanales" error={errors.horasSemanales?.message}>
            <input
              type="number"
              className="input"
              {...register('horasSemanales', { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Semanas" error={errors.semanas?.message}>
            <input
              type="number"
              className="input"
              {...register('semanas', { valueAsNumber: true })}
            />
          </FormField>
        </div>

        {/* Puntos salariales — SearchableSelect acepta number */}
        <Controller
          control={control}
          name="puntosSalarialesId"
          render={({ field, fieldState }) => (
            <SearchableSelect
              label="Puntos Salariales (opcional)"
              options={puntosOptions}
              value={field.value ?? SIN_ASIGNAR}
              onChange={(v) =>
                field.onChange(
                  v === SIN_ASIGNAR || v === undefined ? null : Number(v)
                )
              }
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Proyección en tiempo real */}
        {horasTotal > 0 && (
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm space-y-1">
            <p className="font-medium text-blue-800">Proyección estimada</p>
            <div className="grid grid-cols-3 gap-2 text-blue-700">
              <span>Horas total:</span>
              <span className="col-span-2 font-mono">{horasTotal} h</span>
              <span>Valor hora (pregrado):</span>
              <span className="col-span-2 font-mono">
                {puntosSeleccionado ? formatCOP(valorHoraEstimado) : '—'}
              </span>
              <span>Costo estimado:</span>
              <span className="col-span-2 font-mono font-semibold">
                {puntosSeleccionado ? formatCOP(costoEstimado) : '—'}
              </span>
            </div>
            {puntosSeleccionado && (
              <p className="text-xs text-blue-600 mt-1">
                * El valor definitivo lo calcula el backend según nivel del programa.
              </p>
            )}
          </div>
        )}

        {/* Observaciones */}
        <FormField label="Observaciones" error={errors.observaciones?.message}>
          <textarea
            className="input"
            rows={2}
            {...register('observaciones')}
          />
        </FormField>

        {mutation.error && (
          <p className="text-sm text-red-600">
            {(mutation.error as Error).message}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Registrar'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}