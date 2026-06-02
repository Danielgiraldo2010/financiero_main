import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { vigenciasKeys } from "../../model/queryKeys"
import { fetcher } from "@/shared/api/fetcher"
import type { VigenciaResponse, CrearVigenciaCommand } from "../../model/types"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { FormField } from "@/shared/ui/forms/FormField"
import { toast } from "sonner"

// ── Schema ────────────────────────────────────────────────────────────────────
const crearVigenciaSchema = z
  .object({
    anio: z
      .number({ required_error: "El año es obligatorio" })
      .int()
      .min(2000, "El año debe ser mayor a 2000")
      .max(2100, "El año debe ser menor a 2100"),
    descripcion: z.string().max(200).optional(),
    fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fechaFin:    z.string().min(1, "La fecha de fin es obligatoria"),
  })
  .refine((d) => d.fechaFin > d.fechaInicio, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["fechaFin"],
  })

type CrearVigenciaFormValues = z.infer<typeof crearVigenciaSchema>

// ── API ───────────────────────────────────────────────────────────────────────
function crearVigencia(cmd: CrearVigenciaCommand): Promise<VigenciaResponse> {
  return fetcher("/api/v1/catalogos/vigencias", {
    method: "POST",
    body: JSON.stringify(cmd),
  })
}

// ── Hook ──────────────────────────────────────────────────────────────────────
function useCrearVigencia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearVigencia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vigenciasKeys.all })
    },
  })
}

// ── Estilos compartidos ───────────────────────────────────────────────────────
const INPUT_CLS =
  "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"

// ── Componente ────────────────────────────────────────────────────────────────
interface CrearVigenciaDialogProps {
  open: boolean
  onClose: () => void
}

export function CrearVigenciaDialog({ open, onClose }: CrearVigenciaDialogProps) {
  const { mutate, isPending } = useCrearVigencia()
  const anioActual = new Date().getFullYear()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CrearVigenciaFormValues>({
    resolver: zodResolver(crearVigenciaSchema),
    defaultValues: {
      anio:        anioActual + 1,
      fechaInicio: `${anioActual + 1}-01-01`,
      fechaFin:    `${anioActual + 1}-12-31`,
    },
  })

  const onSubmit: SubmitHandler<CrearVigenciaFormValues> = (values) => {
    mutate(
      {
        anio:        values.anio,
        descripcion: values.descripcion ?? null,
        fechaInicio: values.fechaInicio,
        fechaFin:    values.fechaFin,
      },
      {
        onSuccess: (v) => {
          toast.success(`Vigencia ${v.anio} creada en estado CONFIGURACIÓN`)
          reset()
          onClose()
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Error al crear la vigencia")
        },
      },
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Nueva vigencia"
      description="Crea una vigencia fiscal. Quedará en estado CONFIGURACIÓN hasta que sea habilitada."
      maxWidth="sm"
      closeOnOverlayClick={false}
    >
      <div className="space-y-4 pt-2">
        <FormField
          label="Año"
          required
          {...(errors.anio?.message ? { error: errors.anio.message } : {})}
        >
          <input
            {...register("anio", { valueAsNumber: true })}
            type="number"
            min={2000}
            max={2100}
            className={INPUT_CLS}
          />
        </FormField>

        <FormField
          label="Descripción"
          {...(errors.descripcion?.message ? { error: errors.descripcion.message } : {})}
        >
          <input
            {...register("descripcion")}
            placeholder="Ej: Vigencia fiscal 2027"
            className={INPUT_CLS}
          />
        </FormField>

        <FormField
          label="Fecha de inicio"
          required
          {...(errors.fechaInicio?.message ? { error: errors.fechaInicio.message } : {})}
        >
          <input
            {...register("fechaInicio")}
            type="date"
            className={INPUT_CLS}
          />
        </FormField>

        <FormField
          label="Fecha de fin"
          required
          {...(errors.fechaFin?.message ? { error: errors.fechaFin.message } : {})}
        >
          <input
            {...register("fechaFin")}
            type="date"
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
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? "Creando..." : "Crear vigencia"}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
