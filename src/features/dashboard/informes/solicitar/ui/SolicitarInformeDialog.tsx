import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { solicitarInformeSchema, type SolicitarInformeForm } from "../schema"
import { useSolicitarInforme } from "../hook"
import { TIPOS_INFORME } from "../../../model/types"
import { useUIStore } from "@/shared/state/ui.store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TIPO_LABELS: Record<string, string> = {
  EJECUCION_PRESUPUESTAL: "Ejecucion Presupuestal",
  FLUJO_CAJA:             "Flujo de Caja",
  NOMINA:                 "Nomina",
  CONCILIACION_NOMINA:    "Conciliacion Nomina",
  SAR:                    "SAR / Viaticos",
  CARTERA:                "Cartera",
  CHIP:                   "CHIP",
  AUDITORIA:              "Auditoria",
}

interface Props {
  open: boolean
  onClose: () => void
  onSolicitado?: (id: string) => void
}

export function SolicitarInformeDialog({ open, onClose, onSolicitado }: Props) {
  const vigenciaActiva = useUIStore((s) => s.vigenciaActiva)
  const { mutate, isPending } = useSolicitarInforme()

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<SolicitarInformeForm>({
    resolver: zodResolver(solicitarInformeSchema),
    defaultValues: {
      tipo: "EJECUCION_PRESUPUESTAL",
      vigencia: vigenciaActiva,
      unidadEjecutoraId: null,
      fechaDesde: null,
      fechaHasta: null,
    },
  })

  function onSubmit(data: SolicitarInformeForm) {
    mutate(
      {
        tipo: data.tipo,
        vigencia: data.vigencia,
        unidadEjecutoraId: data.unidadEjecutoraId ?? undefined,
        proyectoId: data.proyectoId ?? undefined,
        fechaDesde: data.fechaDesde ?? undefined,
        fechaHasta: data.fechaHasta ?? undefined,
      },
      {
        onSuccess: (informe) => {
          reset()
          onSolicitado?.(informe.id)
          onClose()
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar informe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Tipo de informe</Label>
            <Controller
              control={control}
              name="tipo"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v: string | null) => field.onChange(v ?? "EJECUCION_PRESUPUESTAL")}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_INFORME.map((t: string) => (
                      <SelectItem key={t} value={t}>{TIPO_LABELS[t] ?? t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipo && <p className="text-xs text-destructive">{errors.tipo.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Vigencia</Label>
            <Input type="number" {...register("vigencia")} />
            {errors.vigencia && <p className="text-xs text-destructive">{errors.vigencia.message}</p>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label>Fecha desde (opcional)</Label>
              <Input type="date" {...register("fechaDesde")} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Fecha hasta (opcional)</Label>
              <Input type="date" {...register("fechaHasta")} />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => { reset(); onClose() }}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? "Solicitando..." : "Solicitar informe"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
