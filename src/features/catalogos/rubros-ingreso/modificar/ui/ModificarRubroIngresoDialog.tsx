import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modificarRubroIngresoSchema, type ModificarRubroIngresoForm } from "../schema"
import { useModificarRubroIngreso } from "../hook"
import type { RubroIngresoResponse } from "../../../model/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props { open: boolean; onClose: () => void; item: RubroIngresoResponse }

export function ModificarRubroIngresoDialog({ open, onClose, item }: Props) {
  const { mutate, isPending } = useModificarRubroIngreso()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ModificarRubroIngresoForm>({
    resolver: zodResolver(modificarRubroIngresoSchema),
    defaultValues: {
      codigoCicp: item.codigoCicp, nombre: item.nombre,
      categoria: item.categoria ?? "", subcategoria: item.subcategoria ?? null,
      estructuraId: item.estructuraId ?? null,
    },
  })
  useEffect(() => {
    if (open) reset({
      codigoCicp: item.codigoCicp, nombre: item.nombre,
      categoria: item.categoria ?? "", subcategoria: item.subcategoria ?? null,
      estructuraId: item.estructuraId ?? null,
    })
  }, [open, item, reset])
  function onSubmit(data: ModificarRubroIngresoForm) {
    mutate(
      { id: item.id, codigoCicp: data.codigoCicp, nombre: data.nombre,
        categoria: data.categoria, subcategoria: data.subcategoria ?? null,
        estructuraId: data.estructuraId ?? null },
      { onSuccess: () => { reset(); onClose() } },
    )
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Rubro de Ingreso</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Codigo CICP</Label>
            <Input {...register("codigoCicp")} />
            {errors.codigoCicp && <p className="text-xs text-destructive">{errors.codigoCicp.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Categoria</Label>
            <Input {...register("categoria")} />
            {errors.categoria && <p className="text-xs text-destructive">{errors.categoria.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Subcategoria (opcional)</Label>
            <Input {...register("subcategoria")} />
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