// features/catalogos/vigencias/cambiar-estado-ue/ui/CambiarEstadoUeDialog.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCambiarEstadoUe } from "../hook"
import type { VigenciaUeResponse } from "../../model/types"
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

// ── Transiciones permitidas por estado actual ─────────────────────────────────
const TRANSICIONES: Record<string, string[]> = {
  PENDIENTE:      ['HABILITADA'],
  HABILITADA:     ['EN_ELABORACION'],
  EN_ELABORACION: ['ENVIADA'],
  ENVIADA:        ['DEVUELTA', 'LIQUIDADA'],
  DEVUELTA:       ['EN_ELABORACION'],
  LIQUIDADA:      ['CERRADA'],
  CERRADA:        [],
}

const ESTADO_LABEL: Record<string, string> = {
  HABILITADA:     'Habilitar para elaboración',
  EN_ELABORACION: 'Iniciar elaboración',
  ENVIADA:        'Enviar a Planeación',
  DEVUELTA:       'Devolver con observaciones',
  LIQUIDADA:      'Liquidar',
  CERRADA:        'Cerrar',
}

// ── Schema dinámico según estado destino ──────────────────────────────────────
const schema = z.object({
  nuevoEstado: z.string(),
  resolucionLiquidacion:  z.string().max(50).optional(),
  fechaLiquidacion:       z.string().optional(),
  urlResolucion:          z.string().max(500).optional(),
  observacionesDevolucion: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.nuevoEstado === 'LIQUIDADA') {
    if (!data.resolucionLiquidacion) {
      ctx.addIssue({ code: 'custom', path: ['resolucionLiquidacion'],
        message: 'El número de resolución es requerido.' })
    }
    if (!data.fechaLiquidacion) {
      ctx.addIssue({ code: 'custom', path: ['fechaLiquidacion'],
        message: 'La fecha de liquidación es requerida.' })
    }
  }
  if (data.nuevoEstado === 'DEVUELTA') {
    if (!data.observacionesDevolucion) {
      ctx.addIssue({ code: 'custom', path: ['observacionesDevolucion'],
        message: 'Las observaciones son requeridas al devolver.' })
    }
  }
})

type FormValues = z.infer<typeof schema>

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  open: boolean
  onClose: () => void
  vigenciaId: number
  ue: VigenciaUeResponse
}

const INPUT_CLS =
  "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"

// ── Componente ────────────────────────────────────────────────────────────────
export function CambiarEstadoUeDialog({ open, onClose, vigenciaId, ue }: Props) {
  const { mutate, isPending } = useCambiarEstadoUe(vigenciaId)
  const transicionesDisponibles = TRANSICIONES[ue.estado] ?? []

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nuevoEstado: transicionesDisponibles[0] ?? '',
    },
  })

  const nuevoEstado = watch('nuevoEstado')

  function onSubmit(data: FormValues) {
    mutate(
      {
        ueId: ue.unidadEjecutoraId,
        req: {
          nuevoEstado:             data.nuevoEstado,
          resolucionLiquidacion:   data.resolucionLiquidacion ?? null,
          fechaLiquidacion:        data.fechaLiquidacion ?? null,
          urlResolucion:           data.urlResolucion ?? null,
          observacionesDevolucion: data.observacionesDevolucion ?? null,
        },
      },
      {
        onSuccess: (vue) => {
          toast.success(
            `${ue.unidadEjecutoraNombre} → ${ESTADO_LABEL[vue.estado] ?? vue.estado}`,
          )
          reset()
          onClose()
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Error al cambiar estado')
        },
      },
    )
  }

  if (transicionesDisponibles.length === 0) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sin transiciones disponibles</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            La UE <strong>{ue.unidadEjecutoraNombre}</strong> está en estado{' '}
            <strong>{ue.estado}</strong> y no tiene transiciones disponibles.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Cambiar estado — {ue.unidadEjecutoraNombre}
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Estado actual: <strong>{ue.estado}</strong>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Selector de transición — solo si hay más de una opción */}
          {transicionesDisponibles.length > 1 ? (
            <div className="flex flex-col gap-1">
              <Label>Nuevo estado <span className="text-destructive">*</span></Label>
              <select
                className={INPUT_CLS}
                onChange={(e) => setValue('nuevoEstado', e.target.value)}
                defaultValue={transicionesDisponibles[0]}
              >
                {transicionesDisponibles.map((e) => (
                  <option key={e} value={e}>{ESTADO_LABEL[e] ?? e}</option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm rounded-md bg-muted px-3 py-2">
              Acción: <strong>{ESTADO_LABEL[transicionesDisponibles[0]!] ?? transicionesDisponibles[0]}</strong>
            </p>
          )}

          {/* Campos requeridos al LIQUIDAR */}
          {nuevoEstado === 'LIQUIDADA' && (
            <>
              <div className="flex flex-col gap-1">
                <Label>N° Resolución de liquidación <span className="text-destructive">*</span></Label>
                <Input
                  {...register('resolucionLiquidacion')}
                  placeholder="Ej: Resolución 045-2026"
                />
                {errors.resolucionLiquidacion && (
                  <p className="text-xs text-destructive">{errors.resolucionLiquidacion.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>Fecha de liquidación <span className="text-destructive">*</span></Label>
                <Input type="date" {...register('fechaLiquidacion')} />
                {errors.fechaLiquidacion && (
                  <p className="text-xs text-destructive">{errors.fechaLiquidacion.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>URL resolución</Label>
                <Input
                  {...register('urlResolucion')}
                  placeholder="https://..."
                />
              </div>
            </>
          )}

          {/* Campo requerido al DEVOLVER */}
          {nuevoEstado === 'DEVUELTA' && (
            <div className="flex flex-col gap-1">
              <Label>Observaciones de devolución <span className="text-destructive">*</span></Label>
              <textarea
                {...register('observacionesDevolucion')}
                rows={4}
                placeholder="Explique los motivos de la devolución para que la UE pueda corregir..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
              {errors.observacionesDevolucion && (
                <p className="text-xs text-destructive">{errors.observacionesDevolucion.message}</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
