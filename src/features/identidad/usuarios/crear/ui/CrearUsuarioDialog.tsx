import { useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  crearUsuarioSchema,
  type CrearUsuarioFormValues,
  getRolesAsignables,
} from "../schema"
import { useCrearUsuario } from "../hook"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { FormField } from "@/shared/ui/forms/FormField"
import { useAuthStore } from "@/shared/state/auth.store"
import { useUnidadesEjecutoras } from "@/features/catalogos/unidades-ejecutoras/listar/hook"

interface CrearUsuarioDialogProps {
  open: boolean
  onClose: () => void
}

const INPUT_CLS =
  "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"

export default function CrearUsuarioDialog({
  open,
  onClose,
}: CrearUsuarioDialogProps) {
  const { mutate, isPending } = useCrearUsuario()
  const rolesDelCreador = useAuthStore((s) => s.roles)
  const rolesAsignables = getRolesAsignables(rolesDelCreador)

  // Cargar TODAS las unidades ejecutoras activas desde el catálogo,
  // no desde el tenant store (que solo contiene la UE del usuario en sesión)
  const { data: uesData, isLoading: cargandoUes } = useUnidadesEjecutoras({
    pagina: 1,
    elementosPorPagina: 100,
  })
  const unidades = (uesData?.items ?? []).filter((ue) => ue.estado === "ACTIVO")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearUsuarioFormValues>({
    resolver: zodResolver(crearUsuarioSchema),
  })

  // Pre-seleccionar cuando solo hay una unidad disponible
  useEffect(() => {
    if (!open) return
    if (unidades.length === 1) {
      setValue("unidadEjecutoraId", unidades[0]!.id)
    }
  }, [open, unidades, setValue])

  const onSubmit: SubmitHandler<CrearUsuarioFormValues> = (values) => {
    mutate(values, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  const unidadBloqueada = unidades.length === 1

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Nuevo usuario"
      description="Complete los datos para crear una cuenta de acceso."
      maxWidth="md"
      closeOnOverlayClick={false}
    >
      <div className="space-y-4 pt-2">

        <FormField
          label="Nombre completo"
          required
          {...(errors.nombreCompleto?.message
            ? { error: errors.nombreCompleto.message }
            : {})}
        >
          <input
            {...register("nombreCompleto")}
            placeholder="Juan Pérez"
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

        <FormField
          label="Contraseña temporal"
          required
          {...(errors.password?.message ? { error: errors.password.message } : {})}
        >
          <input
            {...register("password")}
            type="password"
            placeholder="Mín. 8 caracteres, mayúscula, número y carácter especial"
            className={INPUT_CLS}
          />
        </FormField>

        <FormField
          label="Unidad ejecutora"
          required
          {...(errors.unidadEjecutoraId?.message
            ? { error: errors.unidadEjecutoraId.message }
            : {})}
        >
          <select
            disabled={unidadBloqueada || cargandoUes}
            className={INPUT_CLS}
            // onChange manual: convierte string del DOM a number antes de pasar a RHF
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              if (!isNaN(val)) setValue("unidadEjecutoraId", val)
            }}
          >
            {cargandoUes ? (
              <option value="">Cargando unidades...</option>
            ) : (
              <>
                {!unidadBloqueada && (
                  <option value="">Seleccione una unidad ejecutora...</option>
                )}
                {unidades.map((ue) => (
                  <option key={ue.id} value={ue.id}>
                    {ue.codigo ? `${ue.codigo} — ${ue.nombre}` : ue.nombre}
                  </option>
                ))}
              </>
            )}
          </select>
        </FormField>

        <FormField
          label="Rol"
          required
          {...(errors.rol?.message ? { error: errors.rol.message } : {})}
        >
          <select
            {...register("rol")}
            className={INPUT_CLS}
          >
            <option value="">Seleccione un rol...</option>
            {rolesAsignables.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
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
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? "Creando..." : "Crear usuario"}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
