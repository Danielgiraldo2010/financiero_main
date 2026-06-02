import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modificarUESchema, type ModificarUEForm } from "../schema"
import { useModificarUnidadEjecutora } from "../hook"
import type { UnidadEjecutoraResponse } from "../../../model/types"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  open: boolean
  onClose: () => void
  ue: UnidadEjecutoraResponse
}

export function ModificarUEDialog({ open, onClose, ue }: Props) {
  const { mutate, isPending } = useModificarUnidadEjecutora()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ModificarUEForm>({
    resolver: zodResolver(modificarUESchema),
    defaultValues: { nombre: ue.nombre, nivel: ue.nivel },
  })

  useEffect(() => {
    if (open) reset({ nombre: ue.nombre, nivel: ue.nivel })
  }, [open, ue, reset])

  function onSubmit(data: ModificarUEForm) {
    mutate(
      { id: ue.id, nombre: data.nombre, nivel: data.nivel ? String(data.nivel) : null },
      { onSuccess: () => { reset(); onClose() } },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Unidad Ejecutora</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Nivel</Label>
            <Input type="number" {...register("nivel")} />
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
