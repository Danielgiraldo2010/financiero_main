import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { FormField } from "@/shared/ui/forms/FormField"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTenant } from "@/shared/hooks/useTenant"
import { useCrearEventoAgenda } from "../hook"
import { crearEventoSchema, type CrearEventoForm } from "../../model/schema"
import { TIPOS_EVENTO, PRIORIDADES_EVENTO } from "../../model/constants"

interface Props {
  open: boolean
  onClose: () => void
}

const labelClass = "block text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-1"
const selectClass =
  "h-11 w-full rounded-[12px] border border-[#d1d5db] bg-white px-3.5 text-sm text-[#1f2937] shadow-sm outline-none transition-all hover:border-[#004b82] focus:border-[#0a4f82] focus:ring-4 focus:ring-[#0a4f82]/12"

export function CrearEventoDialog({ open, onClose }: Props) {
  const { tenantActivo } = useTenant()
  const { mutate, isPending } = useCrearEventoAgenda()

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<CrearEventoForm>({
    resolver: zodResolver(crearEventoSchema),
    defaultValues: {
      esRecurrente: false,
      unidadEjecutoraId: tenantActivo?.id ?? 0,
    },
  })

  const esRecurrente = watch("esRecurrente")

  function onSubmit(data: CrearEventoForm) {
    mutate(
      {
        ...data,
        unidadEjecutoraId: tenantActivo?.id ?? 0,
        descripcion: data.descripcion ?? null,
        fechaFin: data.fechaFin ?? null,
        fechaLimite: data.fechaLimite ?? null,
        patronRecurrencia: data.patronRecurrencia ?? null,
        entidadOrigenTipo: data.entidadOrigenTipo ?? null,
        entidadOrigenId: data.entidadOrigenId ?? null,
      },
      { onSuccess: () => { reset(); onClose() } }
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Nuevo evento de agenda" maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

        <FormField label="Título" error={errors.titulo?.message} required>
          <Input {...register("titulo")} placeholder="Nombre del evento" aria-invalid={!!errors.titulo} />
        </FormField>

        <FormField label="Descripción">
          <textarea
            {...register("descripcion")}
            rows={2}
            className="w-full resize-none rounded-[12px] border border-[#d1d5db] bg-white px-3.5 py-2.5 text-sm text-[#1f2937] shadow-sm outline-none transition-all placeholder:text-[#6b7280] hover:border-[#004b82] focus:border-[#0a4f82] focus:ring-4 focus:ring-[#0a4f82]/12"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Tipo" error={errors.tipo?.message} required>
            <select className={selectClass} {...register("tipo")}>
              <option value="">Seleccione...</option>
              {TIPOS_EVENTO.map((t: string) => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Prioridad" error={errors.prioridad?.message} required>
            <select className={selectClass} {...register("prioridad")}>
              <option value="">Seleccione...</option>
              {PRIORIDADES_EVENTO.map((p: string) => <option key={p} value={p}>{p}</option>)}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Fecha inicio" error={errors.fechaInicio?.message} required>
            <Input type="datetime-local" {...register("fechaInicio")} aria-invalid={!!errors.fechaInicio} />
          </FormField>
          <FormField label="Fecha fin">
            <Input type="datetime-local" {...register("fechaFin")} />
          </FormField>
        </div>

        <FormField label="Fecha límite">
          <Input type="date" {...register("fechaLimite")} />
        </FormField>

        <div className="flex items-center gap-2 rounded-[12px] border border-[#d1d5db] bg-[#f8fbfe] px-3.5 py-2.5">
          <input
            type="checkbox"
            id="esRecurrente"
            {...register("esRecurrente")}
            className="h-4 w-4 rounded border-[#d1d5db] accent-[#004b82]"
          />
          <label htmlFor="esRecurrente" className="text-sm font-medium text-[#1f2937]">
            Es recurrente
          </label>
        </div>

        {esRecurrente && (
          <FormField label="Patrón de recurrencia">
            <Input {...register("patronRecurrencia")} placeholder="Ej: WEEKLY, MONTHLY" />
          </FormField>
        )}

        <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Crear evento"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
