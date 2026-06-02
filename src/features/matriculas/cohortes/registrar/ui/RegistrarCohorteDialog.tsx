import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegistrarCohorteSchema, type RegistrarCohorteFormValues } from "../../../model/schema"
import { TIPOS_MATRICULA } from "../../../model/constants"
import { useRegistrarCohorte } from "../hook"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { SelectField } from "@/shared/ui/forms/SelectField"

interface Props {
  open: boolean
  onClose: () => void
}

export function RegistrarCohorteDialog({ open, onClose }: Props) {
  const mutation = useRegistrarCohorte()
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<RegistrarCohorteFormValues>({
    resolver: zodResolver(RegistrarCohorteSchema),
    defaultValues: {
      porcentajeDescuentoVotacion:  0,
      porcentajeOtrosDescuentos:    0,
      porcentajeDescuentoGratuidad: 0,
    },
  })

  const tipoMatricula = watch("tipoMatricula")
  const tipoConfig    = TIPOS_MATRICULA.find((t) => t.value === tipoMatricula)

const onSubmit = async (values: RegistrarCohorteFormValues) => {
  await mutation.mutateAsync({
    vigencia:             values.vigencia,
    periodo:              values.periodo,
    programaAcademicoId:  values.programaAcademicoId,
    unidadEjecutoraId:    values.unidadEjecutoraId,
    cohorte:              values.cohorte,
    numeroEstudiantes:    values.numeroEstudiantes,
    valorMatriculaBase:   values.valorMatriculaBase,
    tipoMatricula:        values.tipoMatricula,
    rubroIngresoId:       values.rubroIngresoId,
    fuenteRecursoId:      values.fuenteRecursoId,
    // Opcionales numéricos sin null — omitir si undefined
    ...(values.porcentajeDescuentoVotacion  !== undefined && { porcentajeDescuentoVotacion:  values.porcentajeDescuentoVotacion }),
    ...(values.porcentajeOtrosDescuentos    !== undefined && { porcentajeOtrosDescuentos:    values.porcentajeOtrosDescuentos }),
    ...(values.porcentajeDescuentoGratuidad !== undefined && { porcentajeDescuentoGratuidad: values.porcentajeDescuentoGratuidad }),
    // Opcionales nullable
    municipioId:            values.municipioId            ?? null,
    transferenciaInternaId: values.transferenciaInternaId ?? null,
    coberturaPickId:        values.coberturaPickId        ?? null,
    descripcion:            values.descripcion            ?? null,
  })
  reset()
  onClose()
}

  const periodoOptions = [
    { value: "1", label: "Período 1" },
    { value: "2", label: "Período 2" },
  ]

  const tipoOptions = TIPOS_MATRICULA.map((t) => ({ value: t.value, label: t.label }))

  return (
    <Dialog open={open} onClose={onClose} title="Registrar Cohorte" maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Vigencia</label>
            <input
              type="number"
              {...register("vigencia", { valueAsNumber: true })}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="2026"
            />
            {errors.vigencia && <p className="text-xs text-destructive">{errors.vigencia.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Período</label>
            <Controller
              control={control}
              name="periodo"
              render={({ field }) => (
                <SelectField
                  options={periodoOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Seleccione..."
                />
              )}
            />
            {errors.periodo && <p className="text-xs text-destructive">{errors.periodo.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Tipo de Matrícula</label>
          <Controller
            control={control}
            name="tipoMatricula"
            render={({ field }) => (
              <SelectField
                options={tipoOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Seleccione el tipo..."
              />
            )}
          />
          {tipoConfig && (
            <p className="text-xs text-muted-foreground mt-1">{tipoConfig.descripcion}</p>
          )}
          {errors.tipoMatricula && <p className="text-xs text-destructive">{errors.tipoMatricula.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nº Cohorte</label>
            <input type="number" {...register("cohorte", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Nº Estudiantes</label>
            <input type="number" {...register("numeroEstudiantes", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Valor Matrícula Base</label>
          <input type="number" step="0.01" {...register("valorMatriculaBase", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
        </div>

        {tipoMatricula === "R30_GRATUIDAD" && (
          <div>
            <label className="text-sm font-medium">% Descuento Gratuidad</label>
            <input type="number" step="0.01" {...register("porcentajeDescuentoGratuidad", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" defaultValue={100} />
          </div>
        )}

        {tipoConfig?.requiereMunicipio && (
          <div className="border border-amber-300 bg-amber-50 rounded p-3 text-sm text-amber-800 space-y-2">
            <p className="font-medium">⚠️ Cobertura PIC — Solo municipios fuera de Manizales</p>
            <div>
              <label className="text-sm font-medium text-foreground">ID Municipio (≠ Manizales)</label>
              <input type="number" {...register("municipioId", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm bg-white" placeholder="Código DIVIPOLA" />
              {errors.municipioId && <p className="text-xs text-destructive">{errors.municipioId.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">ID Cobertura PIC</label>
              <input type="number" {...register("coberturaPickId", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm bg-white" />
            </div>
          </div>
        )}

        {tipoConfig?.requiereTransferenciaInterna && (
          <div>
            <label className="text-sm font-medium">ID Transferencia Interna</label>
            <input type="number" {...register("transferenciaInternaId", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">ID Rubro Ingreso</label>
            <input type="number" {...register("rubroIngresoId", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">ID Fuente Recurso</label>
            <input type="number" {...register("fuenteRecursoId", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>

        {mutation.isError && (
          <div className="text-sm text-destructive bg-destructive/10 rounded p-2">
            Error al registrar la cohorte. Verifique los datos.
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded hover:bg-muted">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {mutation.isPending ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}