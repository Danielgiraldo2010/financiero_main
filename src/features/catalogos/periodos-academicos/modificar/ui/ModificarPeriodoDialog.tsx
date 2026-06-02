import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modificarPeriodoSchema, type ModificarPeriodoForm } from "../schema"
import { useModificarPeriodoAcademico } from "../hook"
import type { PeriodoAcademicoResponse } from "../../../model/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props { open: boolean; onClose: () => void; item: PeriodoAcademicoResponse }

export function ModificarPeriodoDialog({ open, onClose, item }: Props) {
  const { mutate, isPending } = useModificarPeriodoAcademico()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ModificarPeriodoForm>({
    resolver: zodResolver(modificarPeriodoSchema),
    defaultValues: { nombre: item.nombre, fechaInicio: item.fechaInicio, fechaFin: item.fechaFin },
  })
  useEffect(() => {
    if (open) reset({ nombre: item.nombre, fechaInicio: item.fechaInicio, fechaFin: item.fechaFin })
  }, [open, item, reset])
  function onSubmit(data: ModificarPeriodoForm) {
    mutate({ id: item.id, nombre: data.nombre, fechaInicio: data.fechaInicio, fechaFin: data.fechaFin }, { onSuccess: () => { reset(); onClose() } })
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Periodo Academico</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label><Input {...register("nombre")} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Fecha Inicio</Label><Input type="date" {...register("fechaInicio")} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Fecha Fin</Label><Input type="date" {...register("fechaFin")} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Solo se pueden editar periodos en estado ACTIVO.</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}