// src/features/proyectos/cartera/ui/CarteraTab.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { PlusCircle, AlertTriangle } from 'lucide-react'
import { useCartera, useRegistrarFactura } from '../hook'
import { RegistrarFacturaSchema, type RegistrarFacturaForm } from '../model/schema'
import type { CarteraFacturaResponse, RegistrarFacturaPayload } from '@/features/proyectos/model/types'

interface CarteraTabProps {
  proyectoId:        number
  unidadEjecutoraId: number
  vigencia:          number
  rubrosIngreso:     { id: number; nombre: string }[]
}

const formatCOP = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

const estadoColor: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  PARCIAL:   'bg-blue-100 text-blue-800',
  PAGADA:    'bg-emerald-100 text-emerald-800',
  VENCIDA:   'bg-orange-100 text-orange-800',
  EN_COBRO:  'bg-purple-100 text-purple-800',
  ANULADA:   'bg-red-100 text-red-800',
}

export function CarteraTab({
  proyectoId, unidadEjecutoraId, vigencia, rubrosIngreso,
}: CarteraTabProps) {
  const [formOpen, setFormOpen] = useState(false)

  const { data, isLoading, isError } = useCartera({ Vigencia: vigencia, UnidadEjecutoraId: unidadEjecutoraId })
  const registrar = useRegistrarFactura()

  // Filtrar solo las del proyecto actual
  const facturas = (data?.items ?? []).filter(
    (f: CarteraFacturaResponse) => f.proyectoId === proyectoId
  )

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<RegistrarFacturaForm>({
      resolver: zodResolver(RegistrarFacturaSchema),
      defaultValues: { vigencia, unidadEjecutoraId, proyectoId },
    })

  const onSubmit = (form: RegistrarFacturaForm) => {
    // exactOptionalPropertyTypes: construir payload sin keys undefined
    const payload: RegistrarFacturaPayload = {
      numeroFactura:     form.numeroFactura,
      vigencia:          form.vigencia,
      unidadEjecutoraId: form.unidadEjecutoraId,
      clienteNombre:     form.clienteNombre,
      concepto:          form.concepto,
      rubroIngresoId:    form.rubroIngresoId,
      valorFactura:      form.valorFactura,
      fechaFactura:      form.fechaFactura,
      fechaVencimiento:  form.fechaVencimiento,
      ...(form.proyectoId   !== undefined && { proyectoId:   form.proyectoId }),
      ...(form.contratoId   !== undefined && { contratoId:   form.contratoId }),
      ...(form.clienteNit   !== undefined && { clienteNit:   form.clienteNit }),
      ...(form.urlDocumento !== undefined && { urlDocumento: form.urlDocumento }),
    }
    registrar.mutate(payload, {
      onSuccess: () => { reset({ vigencia, unidadEjecutoraId, proyectoId }); setFormOpen(false) },
    })
  }

  if (isLoading) return (
    <div className="space-y-2">
      {[1,2,3].map((i) => <div key={i} className="h-12 rounded bg-muted animate-pulse" />)}
    </div>
  )

  if (isError) return (
    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
      No se pudo cargar la cartera.
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Cartera del proyecto</h3>
        <Button size="sm" variant="outline" onClick={() => setFormOpen((v) => !v)}>
          <PlusCircle className="mr-1.5 h-4 w-4" />
          Nueva factura
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
              <Label>Número de factura *</Label>
              <Input {...register('numeroFactura')} />
              {errors.numeroFactura && <p className="text-xs text-destructive">{errors.numeroFactura.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Cliente *</Label>
              <Input {...register('clienteNombre')} />
              {errors.clienteNombre && <p className="text-xs text-destructive">{errors.clienteNombre.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>NIT cliente</Label>
              <Input {...register('clienteNit')} />
            </div>
            <div className="space-y-1">
              <Label>Valor factura *</Label>
              <Input type="number" min={1} step={0.01} {...register('valorFactura', { valueAsNumber: true })} />
              {errors.valorFactura && <p className="text-xs text-destructive">{errors.valorFactura.message}</p>}
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Concepto *</Label>
              <Input {...register('concepto')} />
              {errors.concepto && <p className="text-xs text-destructive">{errors.concepto.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Rubro de ingreso *</Label>
              <select {...register('rubroIngresoId', { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Seleccione...</option>
                {rubrosIngreso.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
              {errors.rubroIngresoId && <p className="text-xs text-destructive">{errors.rubroIngresoId.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Fecha factura *</Label>
              <Input type="date" {...register('fechaFactura')} />
              {errors.fechaFactura && <p className="text-xs text-destructive">{errors.fechaFactura.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Fecha vencimiento *</Label>
              <Input type="date" {...register('fechaVencimiento')} />
              {errors.fechaVencimiento && <p className="text-xs text-destructive">{errors.fechaVencimiento.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>URL documento</Label>
              <Input {...register('urlDocumento')} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm"
              onClick={() => { reset({ vigencia, unidadEjecutoraId, proyectoId }); setFormOpen(false) }}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={registrar.isPending}>
              {registrar.isPending ? 'Guardando...' : 'Registrar factura'}
            </Button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Factura</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Pendiente</TableHead>
            <TableHead className="text-right">Días mora</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facturas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No hay facturas registradas para este proyecto.
              </TableCell>
            </TableRow>
          ) : facturas.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="font-medium">{f.numeroFactura}</TableCell>
              <TableCell>{f.clienteNombre}</TableCell>
              <TableCell className="text-right">{formatCOP(f.valorFactura)}</TableCell>
              <TableCell className="text-right">{formatCOP(f.valorPendiente)}</TableCell>
              <TableCell className="text-right">
                {f.diasMora > 0 && (
                  <span className="inline-flex items-center gap-1 text-orange-600">
                    <AlertTriangle className="h-3 w-3" />
                    {f.diasMora}
                  </span>
                )}
                {f.diasMora === 0 && '—'}
              </TableCell>
              <TableCell>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${estadoColor[f.estado] ?? 'bg-muted text-muted-foreground'}`}>
                  {f.estado}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
