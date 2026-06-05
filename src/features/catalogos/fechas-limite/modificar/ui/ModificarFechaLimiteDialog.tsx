import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modificarFechaLimiteSchema, type ModificarFechaLimiteForm } from "../schema"
import { useModificarFechaLimite } from "../hook"
import type { FechaLimiteResponse } from "../../../model/types"
import { TIPOS_LIMITE } from "../../../shared/constants"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props { open: boolean; onClose: () => void; item: FechaLimiteResponse }

export function ModificarFechaLimiteDialog({ open, onClose, item }: Props) {
  const { mutate, isPending } = useModificarFechaLimite()
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ModificarFechaLimiteForm>({
    resolver: zodResolver(modificarFechaLimiteSchema),
    defaultValues: {
      tipoLimite: item.tipoLimite, nombre: item.nombre, fechaLimite: item.fechaLimite,
      fechaRecordatorio: item.fechaRecordatorio ?? null,
      diasAnticipacion: item.diasAnticipacionAlerta ?? null,
      descripcion: item.descripcion ?? null,
      unidadEjecutoraId: item.unidadEjecutoraId ?? null,
    },
  })
  useEffect(() => {
    if (open) reset({
      tipoLimite: item.tipoLimite, nombre: item.nombre, fechaLimite: item.fechaLimite,
      fechaRecordatorio: item.fechaRecordatorio ?? null,
      diasAnticipacion: item.diasAnticipacionAlerta ?? null,
      descripcion: item.descripcion ?? null,
      unidadEjecutoraId: item.unidadEjecutoraId ?? null,
    })
  }, [open, item, reset])
  function onSubmit(data: ModificarFechaLimiteForm) {
    mutate({
      id: item.id, tipoLimite: data.tipoLimite, nombre: data.nombre, fechaLimite: data.fechaLimite,
      fechaRecordatorio: data.fechaRecordatorio ?? null,
      diasAnticipacion: data.diasAnticipacion ?? null,
      descripcion: data.descripcion ?? null,
      unidadEjecutoraId: data.unidadEjecutoraId ?? null,
    }, { onSuccess: () => { reset(); onClose() } })
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Fecha Limite</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Tipo Limite</Label>
            <Controller
              control={control}
              name="tipoLimite"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(v: string | null) => field.onChange(v ?? "")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_LIMITE.map((t: string) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipoLimite && <p className="text-xs text-destructive">{errors.tipoLimite.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label>Fecha Limite</Label>
              <Input type="date" {...register("fechaLimite")} />
              {errors.fechaLimite && <p className="text-xs text-destructive">{errors.fechaLimite.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Recordatorio</Label>
              <Input type="date" {...register("fechaRecordatorio")} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Dias anticipacion</Label>
            <Input type="number" {...register("diasAnticipacion")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
