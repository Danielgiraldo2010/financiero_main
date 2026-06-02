// src/features/proyectos/contratos/ui/ContratosTab.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Ban } from 'lucide-react'
import { ConfirmDialog } from '@/shared/ui/overlays/ConfirmDialog'
import { useContratos, useRegistrarContrato, useAnularContrato } from '../hook'
import { RegistrarContratoSchema, type RegistrarContratoForm } from '../model/schema'
import type { ContratoResponse, RegistrarContratoPayload } from '@/features/proyectos/model/types'

interface ContratosTabProps {
  proyectoId:        number
  unidadEjecutoraId: number
  vigencia:          number
  rubrosGasto:       { id: number; nombre: string }[]
  fuentesRecurso:    { id: number; nombre: string }[]
}

const formatCOP = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

const estadoColor: Record<string, string> = {
  EN_PROCESO: 'bg-blue-100 text-blue-800',
  LIQUIDADO:  'bg-emerald-100 text-emerald-800',
  ANULADO:    'bg-red-100 text-red-800',
}

export function ContratosTab({
  proyectoId, unidadEjecutoraId, vigencia, rubrosGasto, fuentesRecurso,
}: ContratosTabProps) {
  const [formOpen, setFormOpen]         = useState(false)
  const [anularTarget, setAnularTarget] = useState<ContratoResponse | null>(null)

  const { data, isLoading, isError } = useContratos({ Vigencia: vigencia })
  const registrar = useRegistrarContrato()
  const anular    = useAnularContrato()

  // Filtrar solo los del proyecto actual
  const contratos = (data?.items ?? []).filter((c) => c.proyectoId === proyectoId)

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<RegistrarContratoForm>({
      resolver: zodResolver(RegistrarContratoSchema),
      defaultValues: { proyectoId, unidadEjecutoraId },
    })

  const onSubmit = (form: RegistrarContratoForm) => {
    // exactOptionalPropertyTypes: construir payload sin keys undefined
    const payload: RegistrarContratoPayload = {
      proyectoId:        form.proyectoId,
      unidadEjecutoraId: form.unidadEjecutoraId,
      numeroContrato:    form.numeroContrato,
      contratista:       form.contratista,
      objetoContrato:    form.objetoContrato,
      valorTotal:        form.valorTotal,
      rubroGastoId:      form.rubroGastoId,
      fuenteRecursoId:   form.fuenteRecursoId,
      fechaInicio:       form.fechaInicio,
      fechaFin:          form.fechaFin,
      ...(form.nitCedula    !== undefined && { nitCedula:    form.nitCedula }),
      ...(form.supervisor   !== undefined && { supervisor:   form.supervisor }),
      ...(form.urlDocumento !== undefined && { urlDocumento: form.urlDocumento }),
    }
    registrar.mutate(payload, {
      onSuccess: () => { reset({ proyectoId, unidadEjecutoraId }); setFormOpen(false) },
    })
  }

  if (isLoading) return (
    <div className="space-y-2">
      {[1,2,3].map((i) => <div key={i} className="h-12 rounded bg-muted animate-pulse" />)}
    </div>
  )

  if (isError) return (
    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
      No se pudieron cargar los contratos.
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Contratos del proyecto</h3>
        <Button size="sm" variant="outline" onClick={() => setFormOpen((v) => !v)}>
          <PlusCircle className="mr-1.5 h-4 w-4" />
          Nuevo contrato
        </Button>
      </div>

      {/* Formulario inline */}
      {formOpen && (
        <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
          {registrar.error && (
            <p className="text-sm text-destructive">{registrar.error.message}</p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Número de contrato *</Label>
              <Input {...register('numeroContrato')} />
              {errors.numeroContrato && <p className="text-xs text-destructive">{errors.numeroContrato.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Contratista *</Label>
              <Input {...register('contratista')} />
              {errors.contratista && <p className="text-xs text-destructive">{errors.contratista.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>NIT / Cédula</Label>
              <Input {...register('nitCedula')} />
            </div>
            <div className="space-y-1">
              <Label>Valor total *</Label>
              <Input type="number" min={1} step={0.01} {...register('valorTotal', { valueAsNumber: true })} />
              {errors.valorTotal && <p className="text-xs text-destructive">{errors.valorTotal.message}</p>}
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Objeto del contrato *</Label>
              <Input {...register('objetoContrato')} />
              {errors.objetoContrato && <p className="text-xs text-destructive">{errors.objetoContrato.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Rubro de gasto *</Label>
              <select {...register('rubroGastoId', { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Seleccione...</option>
                {rubrosGasto.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
              {errors.rubroGastoId && <p className="text-xs text-destructive">{errors.rubroGastoId.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Fuente de recurso *</Label>
              <select {...register('fuenteRecursoId', { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Seleccione...</option>
                {fuentesRecurso.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
              </select>
              {errors.fuenteRecursoId && <p className="text-xs text-destructive">{errors.fuenteRecursoId.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Fecha inicio *</Label>
              <Input type="date" {...register('fechaInicio')} />
              {errors.fechaInicio && <p className="text-xs text-destructive">{errors.fechaInicio.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Fecha fin *</Label>
              <Input type="date" {...register('fechaFin')} />
              {errors.fechaFin && <p className="text-xs text-destructive">{errors.fechaFin.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Supervisor</Label>
              <Input {...register('supervisor')} />
            </div>
            <div className="space-y-1">
              <Label>URL documento</Label>
              <Input {...register('urlDocumento')} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => { reset({ proyectoId, unidadEjecutoraId }); setFormOpen(false) }}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={registrar.isPending}>
              {registrar.isPending ? 'Guardando...' : 'Registrar contrato'}
            </Button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Contratista</TableHead>
            <TableHead className="text-right">Valor total</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {contratos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No hay contratos registrados para este proyecto.
              </TableCell>
            </TableRow>
          ) : contratos.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.numeroContrato}</TableCell>
              <TableCell>{c.contratista}</TableCell>
              <TableCell className="text-right">{formatCOP(c.valorTotal)}</TableCell>
              <TableCell className="text-right">{formatCOP(c.saldoPorPagar)}</TableCell>
              <TableCell>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${estadoColor[c.estado] ?? 'bg-muted text-muted-foreground'}`}>
                  {c.estado}
                </span>
              </TableCell>
              <TableCell>
                {c.estado !== 'ANULADO' && (
                  <button
                    type="button"
                    onClick={() => setAnularTarget(c)}
                    className="text-muted-foreground hover:text-destructive"
                    title="Anular contrato"
                  >
                    <Ban className="h-4 w-4" />
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={!!anularTarget}
        title="Anular contrato"
        description={anularTarget ? `¿Confirma anular el contrato "${anularTarget.numeroContrato}"?` : ''}
        variant="destructive"
        onConfirm={async () => {
          if (anularTarget) await anular.mutateAsync(anularTarget.id)
          setAnularTarget(null)
        }}
        onCancel={() => setAnularTarget(null)}
      />
    </div>
  )
}
