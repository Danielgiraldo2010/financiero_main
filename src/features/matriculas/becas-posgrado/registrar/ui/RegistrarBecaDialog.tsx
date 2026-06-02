import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegistrarBecaSchema, type RegistrarBecaFormValues } from "../../../model/schema"
import { useRegistrarBecaPosgrado } from "../hook"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { SelectField } from "@/shared/ui/forms/SelectField"

interface Props {
  open: boolean
  onClose: () => void
}

/**
 * INVARIANTE I3: vicerrectoriaDetermina = true — NO se muestra en el formulario.
 * Se inyecta automáticamente en la capa API (registrarBecaPosgrado).
 */
export function RegistrarBecaDialog({ open, onClose }: Props) {
  const mutation = useRegistrarBecaPosgrado()
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<RegistrarBecaFormValues>({
    resolver: zodResolver(RegistrarBecaSchema),
  })

  const onSubmit = async (values: RegistrarBecaFormValues) => {
    await mutation.mutateAsync({
  ...values,
  urlResolucion: values.urlResolucion ?? null,
})
    reset()
    onClose()
  }

  const tipoBecaOptions = [
    { value: "DOCTORADO", label: "Doctorado" },
    { value: "MAESTRIA", label: "Maestría" },
    { value: "ESPECIALIZACION", label: "Especialización" },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Registrar Beca Posgrado Minciencias"
      description="La Vicerrectoría de Investigaciones determina la asignación automáticamente."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Vigencia</label>
            <input type="number" {...register("vigencia", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
            {errors.vigencia && <p className="text-xs text-destructive">{errors.vigencia.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Tipo Beca</label>
            <Controller
              control={control}
              name="tipoBeca"
              render={({ field }) => (
                <SelectField options={tipoBecaOptions} value={field.value} onChange={field.onChange} placeholder="Seleccione..." />
              )}
            />
            {errors.tipoBeca && <p className="text-xs text-destructive">{errors.tipoBeca.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Convocatoria Minciencias</label>
          <input type="text" {...register("convocatoriaMinciencias")} className="w-full border rounded px-3 py-2 text-sm" placeholder="Ej: Convocatoria 891 de 2024" />
          {errors.convocatoriaMinciencias && <p className="text-xs text-destructive">{errors.convocatoriaMinciencias.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">ID Programa Académico</label>
            <input type="number" {...register("programaAcademicoId", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">ID Unidad Ejecutora</label>
            <input type="number" {...register("unidadEjecutoraId", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nº Beneficiarios</label>
            <input type="number" {...register("numBeneficiarios", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Valor por Beca</label>
            <input type="number" step="0.01" {...register("valorPorBeca", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">URL Resolución (opcional)</label>
          <input type="url" {...register("urlResolucion")} className="w-full border rounded px-3 py-2 text-sm" placeholder="https://..." />
        </div>

        {mutation.isError && (
          <div className="text-sm text-destructive bg-destructive/10 rounded p-2">Error al registrar la beca. Verifique los datos.</div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded disabled:opacity-50">
            {mutation.isPending ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
