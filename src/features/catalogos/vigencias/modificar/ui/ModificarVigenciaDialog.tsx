// features/catalogos/vigencias/modificar/ui/ModificarVigenciaDialog.tsx
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useModificarVigencia } from "../hook"
import type { VigenciaResponse } from "../../model/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// ── Schema ────────────────────────────────────────────────────────────────────
const schema = z
  .object({
    anio: z
      .number({ required_error: "El año es obligatorio" })
      .int()
      .min(2000)
      .max(2100),
    descripcion:              z.string().max(200).optional(),
    fechaInicio:              z.string().min(1, "Requerido"),
    fechaFin:                 z.string().min(1, "Requerido"),
    numeroAcuerdoAprobacion:  z.string().max(50).optional(),
    fechaAprobacion:          z.string().optional(),
  })
  .refine((d) => !d.fechaFin || !d.fechaInicio || d.fechaFin > d.fechaInicio, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["fechaFin"],
  })

type FormValues = z.infer<typeof schema>

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  open: boolean
  onClose: () => void
  vigencia: VigenciaResponse
}

// ── Componente ────────────────────────────────────────────────────────────────
export function ModificarVigenciaDialog({ open, onClose, vigencia }: Props) {
  const { mutate, isPending } = useModificarVigencia()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(vigencia),
  })

  // Re-sincronizar cuando cambia la vigencia o se abre el dialog
  useEffect(() => {
    if (open) reset(toFormValues(vigencia))
  }, [open, vigencia, reset])

  const esCerrada = vigencia.estado === 'CERRADA'

  function onSubmit(data: FormValues) {
    mutate(
      {
        id:                      vigencia.id,
        anio:                    data.anio,
        descripcion:             data.descripcion ?? null,
        fechaInicio:             data.fechaInicio,
        fechaFin:                data.fechaFin,
        numeroAcuerdoAprobacion: data.numeroAcuerdoAprobacion ?? null,
        fechaAprobacion:         data.fechaAprobacion ?? null,
      },
      {
        onSuccess: () => {
          toast.success(`Vigencia ${data.anio} actualizada`)
          reset()
          onClose()
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Error al actualizar la vigencia")
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Vigencia {vigencia.anio}</DialogTitle>
        </DialogHeader>

        {esCerrada && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Esta vigencia está cerrada y no puede modificarse.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Año */}
          <div className="flex flex-col gap-1">
            <Label>Año <span className="text-destructive">*</span></Label>
            <Input
              type="number"
              {...register("anio", { valueAsNumber: true })}
              disabled={esCerrada}
            />
            {errors.anio && <p className="text-xs text-destructive">{errors.anio.message}</p>}
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1">
            <Label>Descripción</Label>
            <Input
              {...register("descripcion")}
              placeholder="Ej: Vigencia fiscal 2027"
              disabled={esCerrada}
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Fecha inicio <span className="text-destructive">*</span></Label>
              <Input type="date" {...register("fechaInicio")} disabled={esCerrada} />
              {errors.fechaInicio && (
                <p className="text-xs text-destructive">{errors.fechaInicio.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Fecha fin <span className="text-destructive">*</span></Label>
              <Input type="date" {...register("fechaFin")} disabled={esCerrada} />
              {errors.fechaFin && (
                <p className="text-xs text-destructive">{errors.fechaFin.message}</p>
              )}
            </div>
          </div>

          {/* Acuerdo de aprobación */}
          <div className="flex flex-col gap-1">
            <Label>N° Acuerdo de aprobación</Label>
            <Input
              {...register("numeroAcuerdoAprobacion")}
              placeholder="Ej: Acuerdo CS-025-2026"
              disabled={esCerrada}
            />
          </div>

          {/* Fecha de aprobación */}
          <div className="flex flex-col gap-1">
            <Label>Fecha de aprobación</Label>
            <Input type="date" {...register("fechaAprobacion")} disabled={esCerrada} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => { reset(); onClose() }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || esCerrada}>
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function toFormValues(v: VigenciaResponse): FormValues {
  return {
    anio:                    v.anio,
    descripcion:             v.descripcion ?? undefined,
    fechaInicio:             v.fechaInicio,
    fechaFin:                v.fechaFin,
    numeroAcuerdoAprobacion: v.numeroAcuerdoAprobacion ?? undefined,
    fechaAprobacion:         v.fechaAprobacion ?? undefined,
  }
}
