import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useModificarCohorte } from "../hook"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { SelectField } from "@/shared/ui/forms/SelectField"
import { TIPOS_MATRICULA } from "../../../model/constants"
import type { CohorteResponse } from "../../../model/types"

const ModificarCohorteSchema = z.object({
  numeroEstudiantes: z.number().int().min(1),
  valorMatriculaBase: z.number().positive(),
  porcentajeDescuentoVotacion: z.number().min(0).max(100),
  porcentajeOtrosDescuentos: z.number().min(0).max(100),
  porcentajeDescuentoGratuidad: z.number().min(0).max(100),
  tipoMatricula: z.string().optional(),
  transferenciaInternaId: z.number().int().positive().nullable().optional(),
  coberturaPickId: z.number().int().positive().nullable().optional(),
  descripcion: z.string().nullable().optional(),
})

type ModificarCohorteFormValues = z.infer<typeof ModificarCohorteSchema>

interface Props {
  cohorte: CohorteResponse
  open: boolean
  onClose: () => void
}

export function ModificarCohorteDialog({ cohorte, open, onClose }: Props) {
  const mutation = useModificarCohorte()
  const { register, handleSubmit, control, reset, formState: { errors } } =
    useForm<ModificarCohorteFormValues>({
      resolver: zodResolver(ModificarCohorteSchema),
    })

  // Pre-rellenar con datos actuales al abrir
  useEffect(() => {
    if (open) {
      reset({
        numeroEstudiantes: cohorte.numeroEstudiantes,
        valorMatriculaBase: cohorte.valorMatriculaBase,
        porcentajeDescuentoVotacion: cohorte.porcentajeDescuentoVotacion,
        porcentajeOtrosDescuentos: cohorte.porcentajeOtrosDescuentos,
        porcentajeDescuentoGratuidad: cohorte.porcentajeDescuentoGratuidad,
        tipoMatricula: cohorte.tipoMatricula,
        transferenciaInternaId: cohorte.transferenciaInternaId,
        coberturaPickId: cohorte.coberturaPickId,
        descripcion: cohorte.descripcion,
      })
    }
  }, [open, cohorte, reset])

  const tipoOptions = TIPOS_MATRICULA.map((t) => ({ value: t.value, label: t.label }))

  const onSubmit = async (values: ModificarCohorteFormValues) => {
    await mutation.mutateAsync({
  id: cohorte.id,
  ...values,
  descripcion:          values.descripcion          ?? null,
  tipoMatricula:        values.tipoMatricula        ?? null,
  transferenciaInternaId: values.transferenciaInternaId ?? null,
  coberturaPickId:      values.coberturaPickId      ?? null,
})
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title="Modificar Cohorte" maxWidth="lg"
      description={`${cohorte.programaAcademico} — Cohorte ${cohorte.cohorte} · Período ${cohorte.periodo}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nº Estudiantes</label>
            <input type="number" {...register("numeroEstudiantes", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
            {errors.numeroEstudiantes && <p className="text-xs text-destructive">{errors.numeroEstudiantes.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Valor Matrícula Base</label>
            <input type="number" step="0.01" {...register("valorMatriculaBase", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">% Dto. Votación</label>
            <input type="number" step="0.01" {...register("porcentajeDescuentoVotacion", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">% Dto. Otros</label>
            <input type="number" step="0.01" {...register("porcentajeOtrosDescuentos", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">% Dto. Gratuidad</label>
            <input type="number" step="0.01" {...register("porcentajeDescuentoGratuidad", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Tipo de Matrícula</label>
          <Controller
            control={control}
            name="tipoMatricula"
            render={({ field }) => (
              <SelectField options={tipoOptions} value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Descripción</label>
          <textarea {...register("descripcion")} rows={2} className="w-full border rounded px-3 py-2 text-sm" />
        </div>

        {mutation.isError && (
          <div className="text-sm text-destructive bg-destructive/10 rounded p-2">
            Error al modificar la cohorte. Verifique los datos.
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded hover:bg-muted">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded disabled:opacity-50">
            {mutation.isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
