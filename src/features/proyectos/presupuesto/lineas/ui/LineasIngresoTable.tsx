// src/features/proyectos/presupuesto/lineas/ui/LineasIngresoTable.tsx
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
import { AgregarLineaIngresoSchema, type AgregarLineaIngresoInput } from "../schema"
import { useAgregarIngreso } from "../hook"
import type { LineaIngreso, EstadoPresupuesto } from "../../model/types"
import type { AgregarIngresoPayload } from "../api"

const TIPOS_MATRICULA = [
  { value: "PREGRADO",           label: "Pregrado" },
  { value: "POSGRADO",           label: "Posgrado" },
  { value: "EDUCACION_CONTINUA", label: "Educación Continua" },
  { value: "EXTENSION",          label: "Extensión" },
]

interface Props {
  proyectoId:        number
  vigencia:          number
  lineas:            LineaIngreso[]
  estadoPresupuesto: EstadoPresupuesto
  rubrosIngreso:     { id: number; nombre: string }[]
  fuentesRecurso:    { id: number; nombre: string }[]
  editable:          boolean
}

const formatCOP = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v)

export function LineasIngresoTable({
  proyectoId, vigencia, lineas, estadoPresupuesto, rubrosIngreso, fuentesRecurso, editable,
}: Props) {
  const [formOpen, setFormOpen]         = useState(false)
  const [editingId, setEditingId]       = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LineaIngreso | null>(null)
  const agregar = useAgregarIngreso(proyectoId, vigencia)

  const { register, handleSubmit, control, reset, formState: { errors } } =
    useForm<AgregarLineaIngresoInput>({
      resolver: zodResolver(AgregarLineaIngresoSchema),
      defaultValues: { Vigencia: vigencia },
    })

  const onSubmit = (data: AgregarLineaIngresoInput) => {
    const payload: AgregarIngresoPayload = {
      Vigencia:                  data.Vigencia,
      RubroIngresoId:            data.RubroIngresoId,
      FuenteRecursoId:           data.FuenteRecursoId,
      TipoMatricula:             data.TipoMatricula,
      NumEstudiantesProyectados: data.NumEstudiantesProyectados,
      ValorMatriculaUnitario:    data.ValorMatriculaUnitario,
      ValorProyectado:           data.ValorProyectado,
      ...(data.Descripcion !== undefined && { Descripcion: data.Descripcion }),
    }
    agregar.mutate(payload, {
      onSuccess: () => { reset({ Vigencia: vigencia }); setFormOpen(false) },
    })
  }

  const total = lineas.reduce((s, l) => s + l.valorProyectado, 0)

  return (
    <div className="space-y-3">
      {/* Header de sección */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-emerald-500" />
          <h3 className="text-sm font-semibold text-emerald-700">
            Líneas de Ingreso
          </h3>
          {lineas.length > 0 && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
              {lineas.length}
            </span>
          )}
        </div>
        {editable && (
          <Button size="sm" variant="outline"
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            onClick={() => setFormOpen((v) => !v)}>
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
            Agregar línea
          </Button>
        )}
      </div>

      {/* Formulario de nueva línea */}
      {editable && (
        <Collapsible open={formOpen} onOpenChange={setFormOpen}>
          <CollapsibleContent>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
              <p className="text-xs font-medium text-emerald-700">Nueva línea de ingreso</p>
              {agregar.error && (
                <p className="text-sm text-destructive">{agregar.error.message}</p>
              )}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-xs">Rubro de ingreso *</Label>
                  <Controller name="RubroIngresoId" control={control} render={({ field }) => (
                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : ""}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                      <SelectContent>
                        {rubrosIngreso.map((r) => <SelectItem key={r.id} value={String(r.id)} className="text-xs">{r.nombre}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                  {errors.RubroIngresoId && <p className="text-xs text-destructive">{errors.RubroIngresoId.message}</p>}
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
                  <Label className="text-xs">Tipo de matrícula *</Label>
                  <Controller name="TipoMatricula" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                      <SelectContent>
                        {TIPOS_MATRICULA.map((t) => <SelectItem key={t.value} value={t.value} className="text-xs">{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                  {errors.TipoMatricula && <p className="text-xs text-destructive">{errors.TipoMatricula.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Estudiantes proyectados *</Label>
                  <Input className="h-8 text-xs" type="number" min={1}
                    {...register("NumEstudiantesProyectados", { valueAsNumber: true })} />
                  {errors.NumEstudiantesProyectados && <p className="text-xs text-destructive">{errors.NumEstudiantesProyectados.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Valor matrícula unitario *</Label>
                  <Input className="h-8 text-xs" type="number" min={0} step={0.01}
                    {...register("ValorMatriculaUnitario", { valueAsNumber: true })} />
                  {errors.ValorMatriculaUnitario && <p className="text-xs text-destructive">{errors.ValorMatriculaUnitario.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Valor proyectado *</Label>
                  <Input className="h-8 text-xs" type="number" min={1} step={0.01}
                    {...register("ValorProyectado", { valueAsNumber: true })} />
                  {errors.ValorProyectado && <p className="text-xs text-destructive">{errors.ValorProyectado.message}</p>}
                </div>
                <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                  <Label className="text-xs">Descripción</Label>
                  <Input className="h-8 text-xs" {...register("Descripcion")} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => { reset({ Vigencia: vigencia }); setFormOpen(false) }}>
                  <X className="mr-1 h-3.5 w-3.5" /> Cancelar
                </Button>
                <Button size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
      <div className="rounded-lg border border-emerald-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-emerald-50/80 hover:bg-emerald-50/80">
              <TableHead className="text-xs text-emerald-800 font-semibold">Rubro</TableHead>
              <TableHead className="text-xs text-emerald-800 font-semibold">Fuente</TableHead>
              <TableHead className="text-xs text-emerald-800 font-semibold">Tipo</TableHead>
              <TableHead className="text-xs text-emerald-800 font-semibold text-right">Estudiantes</TableHead>
              <TableHead className="text-xs text-emerald-800 font-semibold text-right">Valor proyectado</TableHead>
              <TableHead className="text-xs text-emerald-800 font-semibold text-right">Ejecutado</TableHead>
              {editable && <TableHead className="w-16" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={editable ? 7 : 6} className="py-8 text-center text-sm text-muted-foreground">
                  {editable ? "Agregue líneas de ingreso usando el botón de arriba." : "Sin líneas de ingreso."}
                </TableCell>
              </TableRow>
            ) : lineas.map((l, idx) => (
              <TableRow key={l.id}
                className={idx % 2 === 0
                  ? "bg-white"
                  : "bg-emerald-50/30"
                }>
                <TableCell className="text-xs font-medium">{l.rubroIngreso}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{l.fuenteRecurso}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{l.tipoMatricula ?? "—"}</TableCell>
                <TableCell className="text-xs text-right tabular-nums">{l.numEstudiantesProyectados ?? "—"}</TableCell>
                <TableCell className="text-xs text-right tabular-nums font-medium text-emerald-700">
                  {formatCOP(l.valorProyectado)}
                </TableCell>
                <TableCell className="text-xs text-right tabular-nums text-muted-foreground">
                  {formatCOP(l.valorEjecutado)}
                </TableCell>
                {editable && (
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => setEditingId(l.id)}
                        className="rounded p-1 text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
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
              <TableRow className="bg-emerald-50 font-semibold border-t-2 border-emerald-200">
                <TableCell colSpan={editable ? 4 : 4} className="text-xs">Total ingresos</TableCell>
                <TableCell className="text-xs text-right tabular-nums text-emerald-700">
                  {formatCOP(total)}
                </TableCell>
                <TableCell />
                {editable && <TableCell />}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* TODO: EditarLineaIngresoDialog — pendiente de implementar endpoint PUT en backend */}
      {editingId !== null && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-700">
          Edición de línea #{editingId} — pendiente de endpoint backend (POST /{'{id}'}/presupuesto/ingresos/{'{lineaId}'}/modificar).
          <button type="button" onClick={() => setEditingId(null)} className="ml-2 underline">Cerrar</button>
        </div>
      )}

      {/* Confirmar eliminación */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar línea de ingreso"
        description={deleteTarget ? `¿Eliminar la línea "${deleteTarget.rubroIngreso}" por ${formatCOP(deleteTarget.valorProyectado)}?` : ""}
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
