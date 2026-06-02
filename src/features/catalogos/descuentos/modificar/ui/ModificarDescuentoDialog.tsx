import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modificarDescuentoSchema, type ModificarDescuentoForm } from "../schema"
import { useModificarDescuento } from "../hook"
import type { DescuentoResponse } from "../../../model/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props { open: boolean; onClose: () => void; item: DescuentoResponse }

export function ModificarDescuentoDialog({ open, onClose, item }: Props) {
  const { mutate, isPending } = useModificarDescuento()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ModificarDescuentoForm>({
    resolver: zodResolver(modificarDescuentoSchema),
    defaultValues: { nombre: item.nombre, descripcion: item.descripcion ?? null, porcentaje: item.porcentaje },
  })
  useEffect(() => {
    if (open) reset({ nombre: item.nombre, descripcion: item.descripcion ?? null, porcentaje: item.porcentaje })
  }, [open, item, reset])
  function onSubmit(data: ModificarDescuentoForm) {
    mutate({ id: item.idDescuento, nombre: data.nombre, descripcion: data.descripcion ?? null, porcentaje: data.porcentaje }, { onSuccess: () => { reset(); onClose() } })
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Descuento</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label><Input {...register("nombre")} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Porcentaje (%)</Label><Input type="number" step="0.01" {...register("porcentaje")} />
            {errors.porcentaje && <p className="text-xs text-destructive">{errors.porcentaje.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Descripcion (opcional)</Label><Input {...register("descripcion")} />
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