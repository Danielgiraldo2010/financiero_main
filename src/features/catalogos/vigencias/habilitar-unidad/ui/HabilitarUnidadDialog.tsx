// features/catalogos/vigencias/habilitar-unidad/ui/HabilitarUnidadDialog.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useHabilitarUnidad } from "../hook"
import { useUnidadesEjecutoras } from "@/features/catalogos/unidades-ejecutoras/listar/hook"
import type { VigenciaResponse, VigenciaUeResponse } from "../../model/types"
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
const schema = z.object({
  unidadEjecutoraId: z
    .number({ required_error: "Seleccione una unidad ejecutora" })
    .int()
    .positive("Seleccione una unidad ejecutora"),
  techoComunicado: z
    .number()
    .positive("El techo debe ser mayor a cero")
    .optional(),
  fechaComunicacion: z.string().optional(),
  urlComunicacion:   z.string().max(500).optional(),
  observaciones:     z.string().optional(),
})

type FormValues = z.infer<typeof schema>

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  open: boolean
  onClose: () => void
  vigencia: VigenciaResponse
  uesYaHabilitadas: VigenciaUeResponse[]
}

const INPUT_CLS =
  "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"

// ── Componente ────────────────────────────────────────────────────────────────
export function HabilitarUnidadDialog({
  open,
  onClose,
  vigencia,
  uesYaHabilitadas,
}: Props) {
  const { mutate, isPending } = useHabilitarUnidad()

  // Cargar todas las UEs activas del catálogo
  const { data: catalogoData } = useUnidadesEjecutoras({
    pagina: 1,
    elementosPorPagina: 100,
  })

  // Filtrar las que ya están habilitadas en esta vigencia
  const idsYaHabilitados = new Set(uesYaHabilitadas.map((u) => u.unidadEjecutoraId))
  const uesDisponibles = (catalogoData?.items ?? [])
    .filter((ue) => ue.estado === 'ACTIVO' && !idsYaHabilitados.has(ue.id))

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: FormValues) {
    mutate(
      {
        vigenciaId:        vigencia.id,
        unidadEjecutoraId: data.unidadEjecutoraId,
        techoComunicado:   data.techoComunicado ?? null,
        fechaComunicacion: data.fechaComunicacion ?? null,
        urlComunicacion:   data.urlComunicacion ?? null,
        observaciones:     data.observaciones ?? null,
      },
      {
        onSuccess: (vue) => {
          toast.success(`${vue.unidadEjecutoraNombre} habilitada en vigencia ${vigencia.anio}`)
          reset()
          onClose()
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Error al habilitar la unidad")
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Habilitar Unidad Ejecutora — Vigencia {vigencia.anio}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Unidad ejecutora */}
          <div className="flex flex-col gap-1">
            <Label>Unidad ejecutora <span className="text-destructive">*</span></Label>
            <select
              className={INPUT_CLS}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                if (!isNaN(val)) setValue("unidadEjecutoraId", val)
              }}
            >
              <option value="">Seleccione una unidad ejecutora...</option>
              {uesDisponibles.map((ue) => (
                <option key={ue.id} value={ue.id}>
                  {ue.codigo} — {ue.nombre}
                </option>
              ))}
            </select>
            {errors.unidadEjecutoraId && (
              <p className="text-xs text-destructive">{errors.unidadEjecutoraId.message}</p>
            )}
            {uesDisponibles.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Todas las unidades ejecutoras activas ya están habilitadas en esta vigencia.
              </p>
            )}
          </div>

          {/* Techo comunicado */}
          <div className="flex flex-col gap-1">
            <Label>Techo presupuestal comunicado</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Ej: 5000000000"
              {...register("techoComunicado", { valueAsNumber: true })}
            />
            {errors.techoComunicado && (
              <p className="text-xs text-destructive">{errors.techoComunicado.message}</p>
            )}
          </div>

          {/* Fecha comunicación */}
          <div className="flex flex-col gap-1">
            <Label>Fecha de comunicación</Label>
            <Input type="date" {...register("fechaComunicacion")} />
          </div>

          {/* URL documento de comunicación */}
          <div className="flex flex-col gap-1">
            <Label>URL documento de comunicación</Label>
            <Input
              {...register("urlComunicacion")}
              placeholder="https://..."
            />
          </div>

          {/* Observaciones */}
          <div className="flex flex-col gap-1">
            <Label>Observaciones</Label>
            <textarea
              {...register("observaciones")}
              rows={3}
              placeholder="Condiciones especiales, restricciones, etc."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => { reset(); onClose() }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || uesDisponibles.length === 0}
            >
              {isPending ? "Habilitando..." : "Habilitar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
