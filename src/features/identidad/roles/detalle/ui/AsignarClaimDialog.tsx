import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAsignarClaim } from "../../claims/hook"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { FormField } from "@/shared/ui/forms/FormField"

const schema = z.object({
  permission: z.string().min(1, "El permiso es obligatorio"),
})

type FormValues = z.infer<typeof schema>

interface AsignarClaimDialogProps {
  open: boolean
  roleName: string
  onClose: () => void
}

export default function AsignarClaimDialog({
  open,
  roleName,
  onClose,
}: AsignarClaimDialogProps) {
  const { mutate, isPending } = useAsignarClaim(roleName)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (values: FormValues) => {
    mutate(values.permission,
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
      title="Asignar permiso"
      description={"Agregar un nuevo permiso al rol " + roleName}
    >
      <div className="space-y-4 pt-2">
        <FormField label="Permiso" error={errors.permission?.message}>
          <input
            {...register("permission")}
            placeholder="Ej: proyectos:read"
            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
