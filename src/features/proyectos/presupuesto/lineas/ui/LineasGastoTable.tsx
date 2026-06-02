// src/features/proyectos/presupuesto/lineas/ui/LineasGastoTable.tsx
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { ConfirmDialog } from "@/shared/ui/overlays/ConfirmDialog"
import { PlusCircle, Pencil, Trash2, X, Check } from "lucide-react"
import { AgregarLineaGastoSchema, type AgregarLineaGastoInput } from "../schema"
import { useAgregarGasto } from "../hook"
import type { LineaGasto, EstadoPresupuesto } from "../../model/types"
import type { AgregarGastoPayload } from "../api"

const TIPOS_GASTO = [
  { value: "PERSONAL",       label: "Personal" },
  { value: "SERVICIOS",      label: "Servicios" },
  { value: "MATERIALES",     label: "Materiales y suministros" },
  { value: "EQUIPOS",        label: "Equipos" },
  { value: "TRANSFERENCIAS", label: "Transferencias" },
  { value: "OTROS",          label: "Otros" },
]

interface Props {
  proyectoId:        number
  vigencia:          number
  lineas:            LineaGasto[]
  estadoPresupuesto: EstadoPresupuesto
  rubrosGasto:       { id: number; nombre: string }[]
  fuentesRecurso:    { id: number; nombre: string }[]
  editable:          boolean
}

const formatCOP = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v)

export function LineasGastoTable({
  proyectoId, vigencia, lineas, estadoPresupuesto, rubrosGasto, fuentesRecurso, editable,
}: Props) {
  const [formOpen, setFormOpen]         = useState(false)
  const [editingId, setEditingId]       = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LineaGasto | null>(null)
  const agregar = useAgregarGasto(proyectoId, vigencia)

  const { register, handleSubmit, control, reset, formState: { errors } } =
    useForm<AgregarLineaGastoInput>({
      resolver: zodResolver(AgregarLineaGastoSchema),
      defaultValues: { Vigencia: vigencia },
    })

  const onSubmit = (data: AgregarLineaGastoInput) => {
    const payload: AgregarGastoPayload = {
      Vigencia:        data.Vigencia,
      RubroGastoId:    data.RubroGastoId,
      FuenteRecursoId: data.FuenteRecursoId,
      TipoGasto:       data.TipoGasto,
      ValorProyectado: data.ValorProyectado,
      ...(data.Descripcion !== undefined && { Descripcion: data.Descripcion }),
    }
    agregar.mutate(payload, {
      onSuccess: () => { reset({ Vigencia: vigencia }); setFormOpen(false) },
    })
  }

  const total = lineas.reduce((s, l) => s + l.valorProyectado, 0)

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-rose-500" />
          <h3 className="text-sm font-semibold text-rose-700">
            Líneas de Gasto
          </h3>
          {lineas.length > 0 && (
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700">
              {lineas.length}
            </span>
          )}
        </div>
        {editable && (
          <Button size="sm" variant="outline"
            className="border-rose-200 text-rose-700 hover:bg-rose-50"
            onClick={() => setFormOpen((v) => !v)}>
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
            Agregar línea
          </Button>
        )}
      </div>

      {/* Formulario */}
      {editable && (
        <Collapsible open={formOpen} onOpenChange={setFormOpen}>
          <CollapsibleContent>
            <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-4 space-y-3">
              <p className="text-xs font-medium text-rose-700">Nueva línea de gasto</p>
              {agregar.error && <p className="text-sm text-destructive">{agregar.error.message}</p>}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-xs">Rubro de gasto *</Label>
                  <Controller name="RubroGastoId" control={control} render={({ field }) => (
                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : ""}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                      <SelectContent>
                        {rubrosGasto.map((r) => <SelectItem key={r.id} value={String(r.id)} className="text-xs">{r.nombre}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                  {errors.RubroGastoId && <p className="text-xs text-destructive">{errors.RubroGastoId.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Fuente de recurso *</Label>
                  <Controller name="FuenteRecursoId" control={control} render={({ field }) => (
                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : ""}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                      <SelectContent>
                        {fuentesRecurso.map((f) => <SelectItem key={f.id} value={String(f.id)} className="text-xs">{f.nombre}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                  {errors.FuenteRecursoId && <p className="text-xs text-destructive">{errors.FuenteRecursoId.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tipo de gasto *</Label>
                  <Controller name="TipoGasto" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                      <SelectContent>
                        {TIPOS_GASTO.map((t) => <SelectItem key={t.value} value={t.value} className="text-xs">{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                  {errors.TipoGasto && <p className="text-xs text-destructive">{errors.TipoGasto.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Valor proyectado *</Label>
                  <Input className="h-8 text-xs" type="number" min={1} step={0.01}
                    {...register("ValorProyectado", { valueAsNumber: true })} />
                  {errors.ValorProyectado && <p className="text-xs text-destructive">{errors.ValorProyectado.message}</p>}
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs">Descripción</Label>
                  <Input className="h-8 text-xs" {...register("Descripcion")} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => { reset({ Vigencia: vigencia }); setFormOpen(false) }}>
                  <X className="mr-1 h-3.5 w-3.5" /> Cancelar
                </Button>
                <Button size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                  onClick={handleSubmit(onSubmit)} disabled={agregar.isPending}>
                  <Check className="mr-1 h-3.5 w-3.5" />
                  {agregar.isPending ? "Guardando..." : "Guardar línea"}
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Tabla */}
      <div className="rounded-lg border border-rose-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-rose-50/80 hover:bg-rose-50/80">
              <TableHead className="text-xs text-rose-800 font-semibold">Rubro</TableHead>
              <TableHead className="text-xs text-rose-800 font-semibold">Fuente</TableHead>
              <TableHead className="text-xs text-rose-800 font-semibold">Tipo</TableHead>
              <TableHead className="text-xs text-rose-800 font-semibold text-right">Valor proyectado</TableHead>
              <TableHead className="text-xs text-rose-800 font-semibold text-right">Ejecutado</TableHead>
              {editable && <TableHead className="w-16" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={editable ? 6 : 5} className="py-8 text-center text-sm text-muted-foreground">
                  {editable ? "Agregue líneas de gasto usando el botón de arriba." : "Sin líneas de gasto."}
                </TableCell>
              </TableRow>
            ) : lineas.map((l, idx) => (
              <TableRow key={l.id}
                className={idx % 2 === 0
                  ? "bg-white"
                  : "bg-rose-50/30"
                }>
                <TableCell className="text-xs font-medium">{l.rubroGasto}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{l.fuenteRecurso}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{l.tipoGasto}</TableCell>
                <TableCell className="text-xs text-right tabular-nums font-medium text-rose-700">
                  {formatCOP(l.valorProyectado)}
                </TableCell>
                <TableCell className="text-xs text-right tabular-nums text-muted-foreground">
                  {formatCOP(l.valorEjecutado)}
                </TableCell>
                {editable && (
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => setEditingId(l.id)}
                        className="rounded p-1 text-muted-foreground hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Editar">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => setDeleteTarget(l)}
                        className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Eliminar">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {lineas.length > 0 && (
              <TableRow className="bg-rose-50 font-semibold border-t-2 border-rose-200">
                <TableCell colSpan={3} className="text-xs">Total gastos</TableCell>
                <TableCell className="text-xs text-right tabular-nums text-rose-700">
                  {formatCOP(total)}
                </TableCell>
                <TableCell />
                {editable && <TableCell />}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Placeholder edición */}
      {editingId !== null && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-700">
          Edición de línea #{editingId} — pendiente de endpoint backend (POST /{'{id}'}/presupuesto/gastos/{'{lineaId}'}/modificar).
          <button type="button" onClick={() => setEditingId(null)} className="ml-2 underline">Cerrar</button>
        </div>
      )}

      {/* Confirmar eliminación */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar línea de gasto"
        description={deleteTarget ? `¿Eliminar la línea "${deleteTarget.rubroGasto}" por ${formatCOP(deleteTarget.valorProyectado)}?` : ""}
        variant="destructive"
        onConfirm={() => {
          // TODO: llamar hook de eliminar cuando exista el endpoint
          setDeleteTarget(null)
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
