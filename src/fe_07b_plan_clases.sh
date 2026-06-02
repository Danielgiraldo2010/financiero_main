#!/usr/bin/env bash
# =============================================================================
# fe_07b_plan_clases.sh — FE7-B: Plan de Clases y Horas Dictadas
# =============================================================================
# ENDPOINTS CUBIERTOS (OpenAPI real — 4 de 16 totales):
#   GET  /api/v1/nomina/plan-clases            → ListarPlanClases
#   POST /api/v1/nomina/plan-clases            → RegistrarPlanClases
#   POST /api/v1/nomina/plan-clases/{id}/cerrar → CerrarPlanClases
#   POST /api/v1/nomina/horas-dictadas         → RegistrarHorasDictadas
#
# ENDPOINTS NO EXISTENTES EN OPENAPI (omitidos del plan original):
#   - GET /nomina/plan-clases/{id}             ← no existe
#   - GET /nomina/plan-clases/{id}/proyeccion  ← no existe
#   → ProyeccionCostoPanel usa datos del listado (costoTotalEstimado ya viene en PlanClasesResponse)
#
# CORRECCIONES vs FE7-A (se parchean en este mismo script):
#   - model/types.ts: PuntoSalarial le faltaba valorHoraCatedraPregrado/Posgrado
#   - model/types.ts: vigenteDesdE (typo del backend — E mayúscula — se mapea exacto)
#   - puntos-salariales/listar/ui: agregar columnas de valorHora al listado
#
# SCHEMA REAL RegistrarPlanClasesCommand:
#   empleadoId, periodoAcademicoId, programaAcademicoId, asignatura,
#   codigoAsignatura (null|string), grupo (null|string), horasSemanales,
#   semanas, normaLiquidacion, puntosSalarialesId (null|int), observaciones
#   → NO tiene factorPrestaciones — el plan discriminado z.discriminatedUnion es incorrecto
#
# NOTAS:
#   - open(path, 'w') → sobrescribe siempre. Seguro re-ejecutar.
#   - Los archivos de ROUTES no los genera este script (ver sección al final).
#   - Requiere Python 3 con PYTHONIOENCODING=utf-8
# =============================================================================

set -euo pipefail
export PYTHONIOENCODING=utf-8

python3 - << 'PYEOF'
import os, textwrap

def w(path, content):
    dirn = os.path.dirname(path)
    if dirn:
        os.makedirs(dirn, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(textwrap.dedent(content).lstrip('\n'))
    print(f'  ✔ {path}')

BASE = 'src/features/nomina'

# =============================================================================
# PARCHE FE7-A — model/types.ts
# Agrega valorHoraCatedraPregrado/Posgrado a PuntoSalarial
# Corrige vigenteDesdE (typo backend — E mayúscula)
# =============================================================================
w(f'{BASE}/model/types.ts', """
  // ─── Nómina — tipos base ────────────────────────────────────────────────────
  // Alineados con BD real + OpenAPI real

  export type TipoEmpleado =
    | 'PLANTA'
    | 'OCASIONAL'
    | 'CATEDRATICO'
    | 'SUPERNUMERARIO'
    | 'PLANTA_TEMPORAL'

  export type EstadoEmpleado = 'ACTIVO' | 'INACTIVO'

  export interface Empleado {
    id: number
    tipoIdentificacion: string
    numeroIdentificacion: string
    nombreCompleto: string
    email: string | null
    telefono: string | null
    tipoEmpleado: TipoEmpleado
    cargo: string | null
    salarioBaseMensual: number
    programaAcademicoId: number | null
    programaAcademicoNombre: string | null
    nivelPrograma: string | null
    unidadEjecutoraId: number
    unidadEjecutoraNombre: string
    estado: EstadoEmpleado
    fechaIngreso: string | null
    fechaRetiro: string | null
  }

  // ─── Puntos salariales ───────────────────────────────────────────────────────
  // PuntosSalarialesResponse real incluye valorHoraCatedraPregrado/Posgrado
  // Atención: el backend devuelve "vigenteDesdE" (E mayúscula) — typo confirmado en OpenAPI
  export interface PuntoSalarial {
    id: number
    vigencia: number
    decretoNorma: string
    categoria: string
    nivel: number
    puntosBase: number
    valorPunto: number
    valorHoraCatedraPregrado: number
    valorHoraCatedraPosgrado: number
    factorCategoria: number
    vigenteDesdE: string    // ← typo del backend, E mayúscula
    vigenteHasta: string | null
    estado: string
  }

  // ─── Plan de clases ──────────────────────────────────────────────────────────
  // PlanClasesResponse real (OpenAPI verificado)
  export type EstadoPlanClases = 'ABIERTO' | 'CERRADO'

  export interface PlanClases {
    id: number
    empleadoId: number
    empleadoNombre: string
    tipoEmpleado: string
    periodoAcademicoId: number
    periodoNombre: string
    programaAcademicoId: number
    programaNombre: string
    nivelPrograma: string       // 'PREGRADO' | 'POSGRADO' — string libre del backend
    asignatura: string
    codigoAsignatura: string | null
    grupo: string | null
    horasSemanales: number
    semanas: number
    totalHoras: number          // calculado por backend: horasSemanales × semanas
    valorHora: number           // calculado por backend según norma + puntosSalariales
    valorTotal: number          // totalHoras × valorHora
    normaLiquidacion: string
    puntosSalarialesId: number | null
    estado: EstadoPlanClases
    observaciones: string | null
    costoTotalEstimado: number | null  // puede ser null en planes abiertos
  }

  // ─── Horas dictadas ──────────────────────────────────────────────────────────
  // HorasDictadasResponse real (OpenAPI verificado)
  export interface HorasDictadas {
    id: number
    planClasesId: number
    empleadoNombre: string
    asignatura: string
    mes: number
    nombreMes: string
    horasProyectadas: number
    horasReales: number
    diferencia: number        // backend calcula: horasReales - horasProyectadas
    justificacion: string | null
    estado: string
  }

  // Tipo de respuesta paginada (alinear con PagedResult del backend)
  export interface PagedResult<T> {
    items: T[]
    totalItems: number
    pagina: number
    tamanoPagina: number
    totalPaginas: number
  }
""")

# =============================================================================
# PARCHE FE7-A — puntos-salariales/listar/ui/PuntosSalarialesPage.tsx
# Agrega columnas valorHoraCatedraPregrado/Posgrado y corrige typo vigenteDesdE
# =============================================================================
w(f'{BASE}/puntos-salariales/listar/ui/PuntosSalarialesPage.tsx', """
  import { useState } from 'react'
  import { PageHeader } from '@/shared/ui/layout/PageHeader'
  import { formatCOP } from '@/shared/lib/currency'
  import { usePuntosSalariales } from '../hook'
  import { RegistrarPuntosDialog } from '../../registrar/ui/RegistrarPuntosDialog'

  export function PuntosSalarialesPage() {
    const [openDialog, setOpenDialog] = useState(false)
    const { data, isLoading, isError } = usePuntosSalariales()

    return (
      <div className="space-y-4">
        <PageHeader
          title="Puntos Salariales"
          actions={
            <button className="btn-primary" onClick={() => setOpenDialog(true)}>
              Registrar
            </button>
          }
        />

        {isLoading && <p className="text-sm text-muted">Cargando…</p>}
        {isError && (
          <p className="text-sm text-red-600">Error al cargar puntos salariales.</p>
        )}

        {data && (
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr>
                  <th>Vigencia</th>
                  <th>Decreto</th>
                  <th>Categoría</th>
                  <th>Nivel</th>
                  <th>Puntos Base</th>
                  <th>Valor Punto</th>
                  <th>Valor Hora Pregrado</th>
                  <th>Valor Hora Posgrado</th>
                  <th>Factor Cat.</th>
                  <th>Vigente Desde</th>
                  <th>Vigente Hasta</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr key={p.id}>
                    <td>{p.vigencia}</td>
                    <td>{p.decretoNorma}</td>
                    <td>{p.categoria}</td>
                    <td>{p.nivel}</td>
                    <td>{p.puntosBase}</td>
                    <td>{formatCOP(p.valorPunto)}</td>
                    <td>{formatCOP(p.valorHoraCatedraPregrado)}</td>
                    <td>{formatCOP(p.valorHoraCatedraPosgrado)}</td>
                    <td>{p.factorCategoria}</td>
                    <td>{p.vigenteDesdE}</td>
                    <td>{p.vigenteHasta ?? '—'}</td>
                    <td>
                      <span className={p.estado === 'ACTIVO' ? 'badge-success' : 'badge-neutral'}>
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <RegistrarPuntosDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        />
      </div>
    )
  }
""")

# =============================================================================
# plan-clases/model/queryKeys.ts
# =============================================================================
w(f'{BASE}/plan-clases/model/queryKeys.ts', """
  export const planClasesKeys = {
    all:  () => ['nomina', 'plan-clases']                    as const,
    list: (p?: Record<string, unknown>) =>
            ['nomina', 'plan-clases', 'list', p]             as const,
  }
""")

# =============================================================================
# plan-clases/listar/api.ts
# =============================================================================
w(f'{BASE}/plan-clases/listar/api.ts', """
  import { fetcher } from '@/shared/api/fetcher'
  import type { PlanClases, PagedResult } from '../../model/types'

  export interface ListarPlanClasesParams {
    empleadoId?:         number
    periodoAcademicoId?: number
    estado?:             string
    page?:               number
    pageSize?:           number
  }

  export async function listarPlanClases(
    params?: ListarPlanClasesParams,
  ): Promise<PagedResult<PlanClases>> {
    const qs = new URLSearchParams()
    if (params?.empleadoId)         qs.set('empleadoId',         String(params.empleadoId))
    if (params?.periodoAcademicoId) qs.set('periodoAcademicoId', String(params.periodoAcademicoId))
    if (params?.estado)             qs.set('estado',             params.estado)
    if (params?.page)               qs.set('page',               String(params.page))
    if (params?.pageSize)           qs.set('pageSize',           String(params.pageSize))
    const query = qs.toString() ? `?${qs}` : ''
    return fetcher(`/api/v1/nomina/plan-clases${query}`)
  }
""")

# =============================================================================
# plan-clases/listar/hook.ts
# =============================================================================
w(f'{BASE}/plan-clases/listar/hook.ts', """
  import { useQuery } from '@tanstack/react-query'
  import { planClasesKeys } from '../model/queryKeys'
  import { listarPlanClases, type ListarPlanClasesParams } from './api'

  export function usePlanClases(params?: ListarPlanClasesParams) {
    return useQuery({
      queryKey: planClasesKeys.list(params),
      queryFn:  () => listarPlanClases(params),
    })
  }
""")

# =============================================================================
# plan-clases/registrar/api.ts
# Alineado con RegistrarPlanClasesCommand real — sin factorPrestaciones
# =============================================================================
w(f'{BASE}/plan-clases/registrar/api.ts', """
  import { fetcher } from '@/shared/api/fetcher'
  import type { PlanClases } from '../../model/types'

  // Alineado con RegistrarPlanClasesCommand del OpenAPI real.
  // NO tiene factorPrestaciones — el plan original era incorrecto.
  export interface RegistrarPlanClasesPayload {
    empleadoId:          number
    periodoAcademicoId:  number
    programaAcademicoId: number
    asignatura:          string
    codigoAsignatura:    string | null
    grupo:               string | null
    horasSemanales:      number
    semanas:             number
    normaLiquidacion:    string
    puntosSalarialesId:  number | null
    observaciones:       string | null
  }

  export async function registrarPlanClases(
    payload: RegistrarPlanClasesPayload,
  ): Promise<PlanClases> {
    return fetcher('/api/v1/nomina/plan-clases', {
      method: 'POST',
      body:   JSON.stringify(payload),
    })
  }
""")

# =============================================================================
# plan-clases/registrar/schema.ts
# Schema plano — sin discriminatedUnion ya que el command real no tiene factorPrestaciones
# =============================================================================
w(f'{BASE}/plan-clases/registrar/schema.ts', """
  import { z } from 'zod'

  // NOTA: el plan original describía un schema discriminado por normaLiquidacion
  // con factorPrestaciones condicional. El RegistrarPlanClasesCommand real
  // NO tiene ese campo — se usa schema plano.
  export const RegistrarPlanClasesSchema = z.object({
    empleadoId: z.number({
      required_error: 'Selecciona un empleado',
    }).int().positive(),

    periodoAcademicoId: z.number({
      required_error: 'Selecciona un período académico',
    }).int().positive(),

    programaAcademicoId: z.number({
      required_error: 'Selecciona un programa',
    }).int().positive(),

    asignatura:       z.string().min(1, 'Requerido'),
    codigoAsignatura: z.string().nullable().optional(),
    grupo:            z.string().nullable().optional(),

    horasSemanales: z.number({
      required_error: 'Requerido',
    }).int().min(1, 'Mínimo 1 hora').max(40, 'Máximo 40 horas'),

    semanas: z.number({
      required_error: 'Requerido',
    }).int().min(1, 'Mínimo 1 semana').max(20, 'Máximo 20 semanas'),

    normaLiquidacion: z.string().min(1, 'Selecciona una norma'),

    puntosSalarialesId: z.number().int().positive().nullable().optional(),

    observaciones: z.string().nullable().optional(),
  })

  export type RegistrarPlanClasesFormValues = z.infer<typeof RegistrarPlanClasesSchema>
""")

# =============================================================================
# plan-clases/registrar/hook.ts
# =============================================================================
w(f'{BASE}/plan-clases/registrar/hook.ts', """
  import { useMutation, useQueryClient } from '@tanstack/react-query'
  import { planClasesKeys } from '../model/queryKeys'
  import { registrarPlanClases, type RegistrarPlanClasesPayload } from './api'

  export function useRegistrarPlanClases() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (payload: RegistrarPlanClasesPayload) => registrarPlanClases(payload),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: planClasesKeys.all() })
      },
    })
  }
""")

# =============================================================================
# plan-clases/registrar/ui/RegistrarPlanClasesDialog.tsx
# 07b-I1: nivelPrograma determina valorHora — viene del PuntoSalarial seleccionado
# 07b-I2: normaLiquidacion → selector; factorPrestaciones eliminado (no está en command)
# 07b-I3: ProyeccionCosto inline en el form (preview en tiempo real)
# 07b-I6: SearchableSelect de empleados filtra por TIPOS_EMPLEADO_PLAN_CLASES
# =============================================================================
w(f'{BASE}/plan-clases/registrar/ui/RegistrarPlanClasesDialog.tsx', """
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
    { value: 'GENERAL',          label: 'General' },
    { value: 'ACUERDO_44_2017',  label: 'Acuerdo 44 de 2017' },
    { value: 'DECRETO_1065_1968', label: 'Decreto 1065 de 1968' },
  ]

  interface Props {
    open:    boolean
    onClose: () => void
  }

  export function RegistrarPlanClasesDialog({ open, onClose }: Props) {
    const mutation = useRegistrarPlanClases()

    // Solo empleados habilitados para plan de clases (07b-I6)
    const { data: empleadosData } = useEmpleados()
    const empleadosFiltrados = (empleadosData?.items ?? []).filter((e) =>
      (TIPOS_EMPLEADO_PLAN_CLASES as readonly string[]).includes(e.tipoEmpleado)
    )

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

    // Observar campos para proyección en tiempo real (07b-I3)
    const horasSemanales    = useWatch({ control, name: 'horasSemanales' })
    const semanas           = useWatch({ control, name: 'semanas' })
    const puntosSalarialesId = useWatch({ control, name: 'puntosSalarialesId' })

    const puntosSeleccionado = puntosData?.items.find(
      (p) => p.id === puntosSalarialesId
    )

    // Preview proyección: el backend calcula el valorHora real pero mostramos
    // un estimado con valorHoraCatedraPregrado (el nivelPrograma viene del programa)
    const horasTotal = (horasSemanales ?? 0) * (semanas ?? 0)
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

    const puntosOptions = [
      { value: null as number | null, label: '— Sin asignar —' },
      ...(puntosData?.items ?? []).map((p) => ({
        value: p.id as number | null,
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

          {/* Puntos salariales */}
          <Controller
            control={control}
            name="puntosSalarialesId"
            render={({ field, fieldState }) => (
              <SelectField
                label="Puntos Salariales (opcional)"
                options={puntosOptions}
                value={field.value}
                onChange={(v) => field.onChange(v === null ? null : Number(v))}
                error={fieldState.error?.message}
              />
            )}
          />

          {/* Proyección en tiempo real (07b-I3) */}
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
""")

# =============================================================================
# plan-clases/cerrar/api.ts
# CerrarPlanClasesCommand: { id: int, observaciones: null|string }
# =============================================================================
w(f'{BASE}/plan-clases/cerrar/api.ts', """
  import { fetcher } from '@/shared/api/fetcher'

  export interface CerrarPlanClasesPayload {
    observaciones: string | null
  }

  export async function cerrarPlanClases(
    id: number,
    payload: CerrarPlanClasesPayload,
  ): Promise<void> {
    return fetcher(`/api/v1/nomina/plan-clases/${id}/cerrar`, {
      method: 'POST',
      body:   JSON.stringify({ id, ...payload }),
    })
  }
""")

# =============================================================================
# plan-clases/cerrar/hook.ts
# 07b-I4: operación PESIMISTA — spinner bloqueante
# =============================================================================
w(f'{BASE}/plan-clases/cerrar/hook.ts', """
  import { useMutation, useQueryClient } from '@tanstack/react-query'
  import { planClasesKeys } from '../model/queryKeys'
  import { cerrarPlanClases, type CerrarPlanClasesPayload } from './api'

  export function useCerrarPlanClases() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: CerrarPlanClasesPayload }) =>
        cerrarPlanClases(id, payload),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: planClasesKeys.all() })
      },
    })
  }
""")

# =============================================================================
# plan-clases/cerrar/ui/CerrarPlanClasesDialog.tsx
# 07b-I4: spinner bloqueante, botón deshabilitado durante mutación
# =============================================================================
w(f'{BASE}/plan-clases/cerrar/ui/CerrarPlanClasesDialog.tsx', """
  import { useState } from 'react'
  import { Dialog } from '@/shared/ui/modal/Dialog'
  import { FormField } from '@/shared/ui/forms/FormField'
  import { useCerrarPlanClases } from '../hook'

  interface Props {
    planClasesId:  number
    asignatura:    string
    open:          boolean
    onClose:       () => void
  }

  export function CerrarPlanClasesDialog({
    planClasesId,
    asignatura,
    open,
    onClose,
  }: Props) {
    const [observaciones, setObservaciones] = useState('')
    const cerrar = useCerrarPlanClases()

    const handleCerrar = async () => {
      // 07b-I4: PESIMISTA — el botón se deshabilita mientras la mutación está activa
      await cerrar.mutateAsync({
        id:      planClasesId,
        payload: { observaciones: observaciones.trim() || null },
      })
      setObservaciones('')
      onClose()
    }

    return (
      <Dialog open={open} onClose={onClose} title="Cerrar Plan de Clases">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            ¿Cerrar el plan de clases de{' '}
            <span className="font-semibold">{asignatura}</span>?
            Esta acción marca el plan como finalizado.
          </p>

          <FormField label="Observaciones (opcional)">
            <textarea
              className="input"
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              disabled={cerrar.isPending}
            />
          </FormField>

          {cerrar.error && (
            <p className="text-sm text-red-600">
              {(cerrar.error as Error).message}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={cerrar.isPending}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleCerrar}
              disabled={cerrar.isPending}
            >
              {cerrar.isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Cerrando…
                </span>
              ) : (
                'Cerrar Plan'
              )}
            </button>
          </div>
        </div>
      </Dialog>
    )
  }
""")

# =============================================================================
# plan-clases/listar/ui/PlanClasesPage.tsx
# 07b-I4: CerrarPlanClasesDialog con spinner bloqueante
# 07b-I5: HorasTable embebido como subtabla por plan
# =============================================================================
w(f'{BASE}/plan-clases/listar/ui/PlanClasesPage.tsx', """
  import { useState } from 'react'
  import { PageHeader } from '@/shared/ui/layout/PageHeader'
  import { SelectField } from '@/shared/ui/forms/SelectField'
  import { formatCOP } from '@/shared/lib/currency'
  import { usePlanClases } from '../hook'
  import { RegistrarPlanClasesDialog } from '../../registrar/ui/RegistrarPlanClasesDialog'
  import { CerrarPlanClasesDialog } from '../../cerrar/ui/CerrarPlanClasesDialog'
  import { HorasTable } from '../../../horas-dictadas/listar/ui/HorasTable'
  import type { PlanClases } from '../../../model/types'

  const ESTADO_OPTIONS = [
    { value: '',        label: 'Todos' },
    { value: 'ABIERTO', label: 'Abierto' },
    { value: 'CERRADO', label: 'Cerrado' },
  ]

  export function PlanClasesPage() {
    const [estadoFiltro, setEstadoFiltro]       = useState('')
    const [openRegistrar, setOpenRegistrar]     = useState(false)
    const [planACerrar, setPlanACerrar]         = useState<PlanClases | null>(null)
    const [expandedPlan, setExpandedPlan]       = useState<number | null>(null)

    const { data, isLoading, isError } = usePlanClases(
      estadoFiltro ? { estado: estadoFiltro } : undefined,
    )

    const toggleExpand = (id: number) =>
      setExpandedPlan((prev) => (prev === id ? null : id))

    return (
      <div className="space-y-4">
        <PageHeader
          title="Plan de Clases"
          actions={
            <button className="btn-primary" onClick={() => setOpenRegistrar(true)}>
              Registrar
            </button>
          }
        />

        <div className="w-44">
          <SelectField
            label="Estado"
            options={ESTADO_OPTIONS}
            value={estadoFiltro}
            onChange={setEstadoFiltro}
          />
        </div>

        {isLoading && <p className="text-sm text-muted">Cargando…</p>}
        {isError && (
          <p className="text-sm text-red-600">Error al cargar plan de clases.</p>
        )}

        {data && (
          <div className="space-y-2">
            {data.items.map((plan) => (
              <div
                key={plan.id}
                className="rounded-md border border-gray-200 bg-white"
              >
                {/* Fila principal */}
                <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{plan.asignatura}</p>
                    <p className="text-xs text-muted">{plan.empleadoNombre}</p>
                  </div>
                  <div>
                    <p>{plan.periodoNombre}</p>
                    <p className="text-xs text-muted">{plan.programaNombre} · {plan.nivelPrograma}</p>
                  </div>
                  <div>
                    <p>{plan.horasSemanales}h/sem × {plan.semanas} sem = {plan.totalHoras}h</p>
                    <p className="text-xs text-muted">
                      {formatCOP(plan.valorHora)}/h · Total: {formatCOP(plan.valorTotal)}
                    </p>
                  </div>
                  <span className={
                    plan.estado === 'ABIERTO' ? 'badge-success' : 'badge-neutral'
                  }>
                    {plan.estado}
                  </span>
                  {plan.estado === 'ABIERTO' && (
                    <button
                      className="btn-ghost text-xs text-amber-700"
                      onClick={() => setPlanACerrar(plan)}
                    >
                      Cerrar
                    </button>
                  )}
                  <button
                    className="btn-ghost text-xs"
                    onClick={() => toggleExpand(plan.id)}
                  >
                    {expandedPlan === plan.id ? '▲ Ocultar' : '▼ Horas'}
                  </button>
                </div>

                {/* Subtabla horas dictadas (07b-I5) */}
                {expandedPlan === plan.id && (
                  <div className="border-t border-gray-100 px-4 pb-3 pt-2">
                    <HorasTable planClasesId={plan.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <RegistrarPlanClasesDialog
          open={openRegistrar}
          onClose={() => setOpenRegistrar(false)}
        />

        {planACerrar && (
          <CerrarPlanClasesDialog
            planClasesId={planACerrar.id}
            asignatura={planACerrar.asignatura}
            open={planACerrar !== null}
            onClose={() => setPlanACerrar(null)}
          />
        )}
      </div>
    )
  }
""")

# =============================================================================
# horas-dictadas/registrar/api.ts
# RegistrarHorasCommand: planClasesId, mes, horasProyectadas, horasReales, justificacion
# =============================================================================
w(f'{BASE}/horas-dictadas/registrar/api.ts', """
  import { fetcher } from '@/shared/api/fetcher'
  import type { HorasDictadas } from '../../model/types'

  export interface RegistrarHorasPayload {
    planClasesId:    number
    mes:             number
    horasProyectadas: number
    horasReales:     number
    justificacion:   string | null
  }

  export async function registrarHorasDictadas(
    payload: RegistrarHorasPayload,
  ): Promise<HorasDictadas> {
    return fetcher('/api/v1/nomina/horas-dictadas', {
      method: 'POST',
      body:   JSON.stringify(payload),
    })
  }
""")

# =============================================================================
# horas-dictadas/registrar/schema.ts
# =============================================================================
w(f'{BASE}/horas-dictadas/registrar/schema.ts', """
  import { z } from 'zod'

  export const RegistrarHorasSchema = z.object({
    planClasesId: z.number({
      required_error: 'Requerido',
    }).int().positive(),

    mes: z.number({
      required_error: 'Requerido',
    }).int().min(1, 'Mín. enero (1)').max(12, 'Máx. diciembre (12)'),

    horasProyectadas: z.number({
      required_error: 'Requerido',
    }).nonnegative(),

    horasReales: z.number({
      required_error: 'Requerido',
    }).nonnegative(),

    justificacion: z.string().nullable().optional(),
  })

  export type RegistrarHorasFormValues = z.infer<typeof RegistrarHorasSchema>
""")

# =============================================================================
# horas-dictadas/registrar/hook.ts
# =============================================================================
w(f'{BASE}/horas-dictadas/registrar/hook.ts', """
  import { useMutation, useQueryClient } from '@tanstack/react-query'
  import { registrarHorasDictadas, type RegistrarHorasPayload } from './api'

  // La clave de invalidación usa planClasesId para refrescar la tabla de horas
  // del plan específico. Se define localmente — no hay queryKey factory para horas.
  const horasKey = (planClasesId: number) =>
    ['nomina', 'horas-dictadas', planClasesId] as const

  export function useRegistrarHorasDictadas() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (payload: RegistrarHorasPayload) => registrarHorasDictadas(payload),
      onSuccess: (_data, variables) => {
        qc.invalidateQueries({ queryKey: horasKey(variables.planClasesId) })
      },
    })
  }

  // Exportar la función de query key para que HorasTable pueda usarla
  export { horasKey }
""")

# =============================================================================
# horas-dictadas/registrar/ui/RegistrarHorasDialog.tsx
# =============================================================================
w(f'{BASE}/horas-dictadas/registrar/ui/RegistrarHorasDialog.tsx', """
  import { useForm } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { Dialog } from '@/shared/ui/modal/Dialog'
  import { FormField } from '@/shared/ui/forms/FormField'
  import { RegistrarHorasSchema, type RegistrarHorasFormValues } from '../schema'
  import { useRegistrarHorasDictadas } from '../hook'

  const MES_OPTIONS = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
  ]

  interface Props {
    planClasesId: number
    open:         boolean
    onClose:      () => void
  }

  export function RegistrarHorasDialog({ planClasesId, open, onClose }: Props) {
    const mutation = useRegistrarHorasDictadas()

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<RegistrarHorasFormValues>({
      resolver: zodResolver(RegistrarHorasSchema),
      defaultValues: {
        planClasesId,
        justificacion: null,
      },
    })

    const onSubmit = handleSubmit(async (values) => {
      await mutation.mutateAsync({
        ...values,
        justificacion: values.justificacion ?? null,
      })
      reset({ planClasesId, justificacion: null })
      onClose()
    })

    return (
      <Dialog open={open} onClose={onClose} title="Registrar Horas Dictadas">
        <form onSubmit={onSubmit} className="space-y-4">

          <FormField label="Mes" error={errors.mes?.message}>
            <select className="input" {...register('mes', { valueAsNumber: true })}>
              <option value="">Seleccionar mes</option>
              {MES_OPTIONS.map((nombre, i) => (
                <option key={i + 1} value={i + 1}>
                  {nombre}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Horas Proyectadas" error={errors.horasProyectadas?.message}>
              <input
                type="number"
                step="0.5"
                className="input"
                {...register('horasProyectadas', { valueAsNumber: true })}
              />
            </FormField>
            <FormField label="Horas Reales" error={errors.horasReales?.message}>
              <input
                type="number"
                step="0.5"
                className="input"
                {...register('horasReales', { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <FormField label="Justificación" error={errors.justificacion?.message}>
            <textarea
              className="input"
              rows={2}
              {...register('justificacion')}
              placeholder="Requerida si existen diferencias"
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
""")

# =============================================================================
# horas-dictadas/listar/ui/HorasTable.tsx
# 07b-I5: subtabla embebida dentro de PlanClasesPage
# Nota: no hay GET /horas-dictadas en el OpenAPI — la tabla se hidrata
# vía cache (onSuccess de useRegistrarHorasDictadas) o como datos locales.
# Se implementa con query key local para coherencia con el hook de registro.
# =============================================================================
w(f'{BASE}/horas-dictadas/listar/ui/HorasTable.tsx', """
  import { useState } from 'react'
  import { useQuery } from '@tanstack/react-query'
  import { fetcher } from '@/shared/api/fetcher'
  import type { HorasDictadas } from '../../../model/types'
  import { RegistrarHorasDialog } from '../../registrar/ui/RegistrarHorasDialog'
  import { horasKey } from '../../registrar/hook'

  interface Props {
    planClasesId: number
  }

  // GET /api/v1/nomina/horas-dictadas?planClasesId={id}
  // El endpoint no está en el listado principal del OpenAPI pero es necesario
  // para mostrar el historial. Si el backend no lo implementa, la tabla
  // mostrará empty state hasta que se registre la primera entrada.
  async function fetchHorasByPlan(planClasesId: number): Promise<HorasDictadas[]> {
    const result = await fetcher(
      `/api/v1/nomina/horas-dictadas?planClasesId=${planClasesId}`,
    )
    // El backend puede devolver array directo o PagedResult
    return Array.isArray(result) ? result : (result as { items: HorasDictadas[] }).items
  }

  const MES_NOMBRES = [
    '', 'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
  ]

  export function HorasTable({ planClasesId }: Props) {
    const [openDialog, setOpenDialog] = useState(false)

    const { data, isLoading } = useQuery({
      queryKey: horasKey(planClasesId),
      queryFn:  () => fetchHorasByPlan(planClasesId),
    })

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Horas Dictadas
          </p>
          <button
            className="btn-ghost text-xs text-blue-600"
            onClick={() => setOpenDialog(true)}
          >
            + Registrar horas
          </button>
        </div>

        {isLoading && (
          <p className="text-xs text-muted">Cargando horas…</p>
        )}

        {!isLoading && (!data || data.length === 0) && (
          <p className="text-xs text-muted italic">Sin registros de horas aún.</p>
        )}

        {data && data.length > 0 && (
          <table className="table w-full text-xs">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Proyectadas</th>
                <th>Reales</th>
                <th>Diferencia</th>
                <th>Justificación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((h) => (
                <tr key={h.id}>
                  <td>{h.nombreMes || MES_NOMBRES[h.mes] || h.mes}</td>
                  <td>{h.horasProyectadas}</td>
                  <td>{h.horasReales}</td>
                  <td className={
                    h.diferencia < 0
                      ? 'text-red-600 font-medium'
                      : h.diferencia > 0
                        ? 'text-green-600'
                        : ''
                  }>
                    {h.diferencia > 0 ? '+' : ''}{h.diferencia}
                  </td>
                  <td>{h.justificacion ?? '—'}</td>
                  <td>
                    <span className={h.estado === 'APROBADO' ? 'badge-success' : 'badge-neutral'}>
                      {h.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <RegistrarHorasDialog
          planClasesId={planClasesId}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        />
      </div>
    )
  }
""")

# =============================================================================
# index.ts — actualizar barrel para incluir FE7-B
# =============================================================================
w(f'{BASE}/index.ts', """
  // ─── Barrel principal del dominio Nómina ─────────────────────────────────────
  // FE7-A: empleados + puntos salariales
  // FE7-B: plan de clases + horas dictadas

  // Modelo raíz
  export type {
    Empleado, TipoEmpleado, EstadoEmpleado,
    PuntoSalarial,
    PlanClases, EstadoPlanClases,
    HorasDictadas,
    PagedResult,
  } from './model/types'

  export {
    TIPO_EMPLEADO_LABELS,
    TIPO_EMPLEADO_OPTIONS,
    TIPOS_EMPLEADO_PLAN_CLASES,
  } from './model/constants'

  export { nominaKeys } from './model/queryKeys'

  // Empleados
  export { useEmpleados }          from './empleados/listar/hook'
  export { useRegistrarEmpleado }  from './empleados/registrar/hook'
  export { useDesactivarEmpleado } from './empleados/desactivar/hook'
  export { EmpleadosPage }         from './empleados/listar/ui/EmpleadosPage'

  // Puntos salariales
  export { usePuntosSalariales }           from './puntos-salariales/listar/hook'
  export { useRegistrarPuntosSalariales }  from './puntos-salariales/registrar/hook'
  export { PuntosSalarialesPage }          from './puntos-salariales/listar/ui/PuntosSalarialesPage'

  // Plan de clases
  export { usePlanClases }           from './plan-clases/listar/hook'
  export { useRegistrarPlanClases }  from './plan-clases/registrar/hook'
  export { useCerrarPlanClases }     from './plan-clases/cerrar/hook'
  export { PlanClasesPage }          from './plan-clases/listar/ui/PlanClasesPage'

  // Horas dictadas
  export { useRegistrarHorasDictadas } from './horas-dictadas/registrar/hook'
  export { HorasTable }                from './horas-dictadas/listar/ui/HorasTable'
""")

# =============================================================================
# contexto_fe07b.md
# =============================================================================
w('contexto_fe07b.md', """
  # contexto_fe07b.md — FE7-B: Plan de Clases y Horas Dictadas

  ## Hooks exportados

  ```
  features/nomina/plan-clases/listar/hook.ts
    → usePlanClases(params?): UseQueryResult<PagedResult<PlanClases>>

  features/nomina/plan-clases/registrar/hook.ts
    → useRegistrarPlanClases(): UseMutationResult

  features/nomina/plan-clases/cerrar/hook.ts
    → useCerrarPlanClases(): UseMutationResult<void, Error, {id, payload}>

  features/nomina/horas-dictadas/registrar/hook.ts
    → useRegistrarHorasDictadas(): UseMutationResult
    → horasKey(planClasesId): QueryKey   ← para invalidación manual
  ```

  ## Tipos exportados (actualizados vs FE7-A)

  ```
  features/nomina/model/types.ts
    → PlanClases, EstadoPlanClases, HorasDictadas
    → PuntoSalarial (ACTUALIZADO: +valorHoraCatedraPregrado, +valorHoraCatedraPosgrado)
    → PagedResult (ACTUALIZADO: totalItems/pagina/tamanoPagina/totalPaginas)
    → Empleado (ACTUALIZADO: programaAcademicoNombre, nivelPrograma, unidadEjecutoraNombre)
  ```

  ## Decisiones de diseño

  | Plan FE7-B original                         | Realidad OpenAPI             | Decisión               |
  |---------------------------------------------|------------------------------|------------------------|
  | Schema discriminado por normaLiquidacion     | Command sin factorPrestaciones | Schema plano           |
  | GET /plan-clases/{id}                        | No existe                    | Omitido                |
  | GET /plan-clases/{id}/proyeccion             | No existe                    | Omitido                |
  | usePlanClaseProyeccion(id)                   | No existe endpoint           | Eliminado              |
  | ProyeccionCostoPanel (panel separado)        | costoTotalEstimado en response | Preview inline en form |

  ## ProyeccionCosto

  El backend devuelve `costoTotalEstimado` directamente en `PlanClasesResponse`.
  No hay endpoint de proyección separado. El form muestra estimado en tiempo real
  usando `valorHoraCatedraPregrado` del PuntoSalarial seleccionado + watch().

  ## HorasTable

  Usa GET /api/v1/nomina/horas-dictadas?planClasesId={id}  
  Este endpoint no figura en la tabla de endpoints del OpenAPI.  
  Si el backend no lo implementa, la tabla mostrará empty state.  
  El queryKey coincide con el de useRegistrarHorasDictadas para invalidación automática.

  ## Estado del proyecto

  FE7-A ✅ | FE7-B ✅ | Próxima charla → fe_07c_liquidacion_conciliacion.sh
""")

print()
print('✅  fe_07b completado — archivos generados:')
print('   src/features/nomina/model/types.ts           ← PARCHEADO (PuntoSalarial, Empleado, PagedResult)')
print('   src/features/nomina/puntos-salariales/listar/ui/PuntosSalarialesPage.tsx ← PARCHEADO')
print('   src/features/nomina/plan-clases/**')
print('   src/features/nomina/horas-dictadas/**')
print('   src/features/nomina/index.ts                 ← actualizado con FE7-B')
print('   contexto_fe07b.md')
print()
print('─── ROUTES (copiar manualmente) ────────────────────────────────────────')
print("""
// src/app/router/routes/_authenticated/nomina/plan-clases.tsx
import { createFileRoute } from '@tanstack/react-router'
import { PlanClasesPage } from '@/features/nomina'

export const Route = createFileRoute('/_authenticated/nomina/plan-clases')({
  staticData: { breadcrumb: 'Plan de Clases' },
  component: PlanClasesPage,
})

// Agregar tab en nomina/index.tsx:
// { to: '/nomina/plan-clases', label: 'Plan de Clases' }
""")

PYEOF
