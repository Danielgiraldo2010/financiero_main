import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegistrarCoberturaSchema, type RegistrarCoberturaFormValues } from "../../../model/schema"
import { useRegistrarCoberturaPic } from "../hook"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { SelectField } from "@/shared/ui/forms/SelectField"

interface Props {
  open: boolean
  onClose: () => void
}

/**
 * INVARIANTE I2: El schema Zod rechaza municipioId === MUNICIPIO_MANIZALES_ID
 * con mensaje de error explícito al usuario.
 */
export function RegistrarCoberturaDialog({ open, onClose }: Props) {
  const mutation = useRegistrarCoberturaPic()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RegistrarCoberturaFormValues>({
    resolver: zodResolver(RegistrarCoberturaSchema),
    defaultValues: { porcentajeCobertura: 50 },
  })

  const onSubmit = async (values: RegistrarCoberturaFormValues) => {
    await mutation.mutateAsync({
  ...values,
  porcentajeCobertura: values.porcentajeCobertura ?? 50,
})
    reset()
    onClose()
  }

  const periodoOptions = [
    { value: "1", label: "Período 1" },
    { value: "2", label: "Período 2" },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Registrar Cobertura PIC"
      description="El PIC aplica únicamente para programas en municipios distintos a Manizales."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Vigencia</label>
            <input type="number" {...register("vigencia", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Período</label>
            <Controller
              control={control}
              name="periodo"
              render={({ field }) => (
                <SelectField options={periodoOptions} value={field.value} onChange={field.onChange} placeholder="Seleccione..." />
              )}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">ID Programa Académico</label>
          <input type="number" {...register("programaAcademicoId", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium">Municipio (≠ Manizales)</label>
          <input type="number" {...register("municipioId", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" placeholder="Código DIVIPOLA" />
          {errors.municipioId && <p className="text-xs text-destructive mt-1">{errors.municipioId.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nº Estudiantes</label>
            <input type="number" {...register("numEstudiantesBeneficiarios", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Valor Matrícula Base</label>
            <input type="number" step="0.01" {...register("valorMatriculaBase", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">% Cobertura (default 50%)</label>
          <input type="number" step="0.01" min="1" max="100" {...register("porcentajeCobertura", { valueAsNumber: true })} className="w-full border rounded px-3 py-2 text-sm" />
        </div>

        {mutation.isError && (
          <div className="text-sm text-destructive bg-destructive/10 rounded p-2">Error al registrar la cobertura PIC.</div>
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
