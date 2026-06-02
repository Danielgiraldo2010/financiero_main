import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modificarUsuarioSchema, type ModificarUsuarioFormValues } from "../schema"
import { useModificarUsuario } from "../hook"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { FormField } from "@/shared/ui/forms/FormField"
import type { Usuario } from "../../model/types"

interface ModificarUsuarioDialogProps {
  open: boolean
  usuario: Usuario
  onClose: () => void
}

const INPUT_CLS =
  "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"

export default function ModificarUsuarioDialog({
  open,
  usuario,
  onClose,
}: ModificarUsuarioDialogProps) {
  const { mutate, isPending } = useModificarUsuario(usuario.id)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ModificarUsuarioFormValues>({
    resolver: zodResolver(modificarUsuarioSchema),
    defaultValues: {
      // ✅ nombreCompleto: string | null — sin ?? null problemático
      nombreCompleto: usuario.nombreCompleto,
      email: usuario.email,
      userName: usuario.userName,
    },
  })

  const onSubmit: SubmitHandler<ModificarUsuarioFormValues> = (values) => {
    mutate(
      {
        // ✅ ModificarUsuarioCommand ahora acepta string | null
        nombreCompleto: values.nombreCompleto ?? null,
        email: values.email,
        userName: values.userName,
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Editar usuario"
      description={`Modificando datos de ${usuario.nombreCompleto ?? usuario.userName}`}
      maxWidth="md"
    >
      <div className="space-y-4 pt-2">

        {/* ✅ Patrón spread condicional para exactOptionalPropertyTypes */}
        <FormField
          label="Nombre completo"
          {...(errors.nombreCompleto?.message
            ? { error: errors.nombreCompleto.message }
            : {})}
        >
          <input
            {...register("nombreCompleto")}
            placeholder="Juan Perez"
            className={INPUT_CLS}
          />
        </FormField>

        <FormField
          label="Email institucional"
          required
          {...(errors.email?.message ? { error: errors.email.message } : {})}
        >
          <input
            {...register("email")}
            type="email"
            placeholder="usuario@ucaldas.edu.co"
            className={INPUT_CLS}
          />
        </FormField>

        <FormField
          label="Nombre de usuario"
          required
          {...(errors.userName?.message ? { error: errors.userName.message } : {})}
        >
          <input
            {...register("userName")}
            placeholder="jperez"
            autoCapitalize="none"
            autoCorrect="off"
            className={INPUT_CLS}
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-md px-4 py-2 text-sm font-medium border border-input hover:bg-accent disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isPending || !isDirty}
            onClick={handleSubmit(onSubmit)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </Dialog>
  )
}