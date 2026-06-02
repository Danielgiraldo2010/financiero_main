import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAsignarUE } from "../../acciones/hook"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { FormField } from "@/shared/ui/forms/FormField"

const schema = z.object({
  unidadEjecutoraId: z.number({ required_error: "Seleccione una unidad" }),
  rol: z.string().min(1, "El rol es obligatorio"),
  subDependencia: z.string().nullable(),
  fechaVencimiento: z.string().nullable(),
})

type FormValues = z.infer<typeof schema>

const ROLES = [
  "SUPERADMIN",
  "ADMIN_CENTRAL",
  "FINANCIERO_CENTRAL",
  "DECANO",
  "COORDINADOR",
  "FINANCIERO",
  "CONSULTOR",
]

interface AsignarUEDialogProps {
  open: boolean
  usuarioId: string
  onClose: () => void
}

export default function AsignarUEDialog({
  open,
  usuarioId,
  onClose,
}: AsignarUEDialogProps) {
  const { mutate, isPending } = useAsignarUE(usuarioId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      subDependencia: null,
      fechaVencimiento: null,
    },
  })

  const onSubmit = (values: FormValues) => {
    mutate(
      {
        usuarioId,
        unidadEjecutoraId: values.unidadEjecutoraId,
        rol: values.rol,
        subDependencia: values.subDependencia || null,
        fechaVencimiento: values.fechaVencimiento || null,
      },
      {
        onSuccess: () => {
          reset()
          onClose()
        },
      }
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Asignar unidad ejecutora"
      description="Seleccione la unidad y el rol para este usuario."
    >
      <div className="space-y-4 pt-2">
        <FormField
          label="ID Unidad ejecutora"
          error={errors.unidadEjecutoraId?.message}
        >
          <input
            {...register("unidadEjecutoraId", { valueAsNumber: true })}
            type="number"
            placeholder="Ej: 1"
            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </FormField>

        <FormField label="Rol" error={errors.rol?.message}>
          <select
            {...register("rol")}
            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Seleccione un rol</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Subdependencia (opcional)">
          <input
            {...register("subDependencia")}
            placeholder="Ej: Facultad de Ciencias"
            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </FormField>

        <FormField label="Fecha de vencimiento (opcional)">
          <input
            {...register("fechaVencimiento")}
            type="date"
            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium border border-input hover:bg-accent"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? "Asignando..." : "Asignar"}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
