import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modificarApoyoSchema, type ModificarApoyoForm } from "../schema"
import { useModificarApoyoMatricula } from "../hook"
import type { ApoyoMatriculaResponse } from "../../../model/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props { open: boolean; onClose: () => void; item: ApoyoMatriculaResponse }

export function ModificarApoyoDialog({ open, onClose, item }: Props) {
  const { mutate, isPending } = useModificarApoyoMatricula()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ModificarApoyoForm>({
    resolver: zodResolver(modificarApoyoSchema),
    defaultValues: { codigo: item.codigo, nombre: item.nombre, tipo: item.tipo, rubroIngresoId: item.rubroIngresoId },
  })
  useEffect(() => {
    if (open) reset({ codigo: item.codigo, nombre: item.nombre, tipo: item.tipo, rubroIngresoId: item.rubroIngresoId })
  }, [open, item, reset])
  function onSubmit(data: ModificarApoyoForm) {
    mutate({ id: item.id, ...data }, { onSuccess: () => { reset(); onClose() } })
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Apoyo de Matricula</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1"><Label>Codigo</Label><Input {...register("codigo")} />{errors.codigo && <p className="text-xs text-destructive">{errors.codigo.message}</p>}</div>
          <div className="flex flex-col gap-1"><Label>Nombre</Label><Input {...register("nombre")} />{errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}</div>
          <div className="flex flex-col gap-1"><Label>Tipo</Label><Input {...register("tipo")} />{errors.tipo && <p className="text-xs text-destructive">{errors.tipo.message}</p>}</div>
          <div className="flex flex-col gap-1"><Label>ID Rubro Ingreso</Label><Input type="number" {...register("rubroIngresoId")} />{errors.rubroIngresoId && <p className="text-xs text-destructive">{errors.rubroIngresoId.message}</p>}</div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}