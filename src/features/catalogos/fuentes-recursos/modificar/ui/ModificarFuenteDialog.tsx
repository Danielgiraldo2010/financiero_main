import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modificarFuenteSchema, type ModificarFuenteForm } from "../schema"
import { useModificarFuenteRecurso } from "../hook"
import type { FuenteRecursoResponse } from "../../../model/types"
import { TIPOS_FUENTE } from "../../../shared/constants"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props { open: boolean; onClose: () => void; item: FuenteRecursoResponse }

export function ModificarFuenteDialog({ open, onClose, item }: Props) {
  const { mutate, isPending } = useModificarFuenteRecurso()
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ModificarFuenteForm>({
    resolver: zodResolver(modificarFuenteSchema),
    defaultValues: { codigo: item.codigo, nombre: item.nombre, tipo: item.tipo, descripcion: item.descripcion ?? null },
  })
  useEffect(() => {
    if (open) reset({ codigo: item.codigo, nombre: item.nombre, tipo: item.tipo, descripcion: item.descripcion ?? null })
  }, [open, item, reset])
  function onSubmit(data: ModificarFuenteForm) {
    mutate(
      { id: item.id, codigo: data.codigo, nombre: data.nombre, tipo: data.tipo, descripcion: data.descripcion ?? null },
      { onSuccess: () => { reset(); onClose() } },
    )
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Fuente de Recurso</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Codigo</Label>
            <Input {...register("codigo")} />
            {errors.codigo && <p className="text-xs text-destructive">{errors.codigo.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Tipo</Label>
            <Controller
              control={control}
              name="tipo"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(v: string | null) => field.onChange(v ?? "")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_FUENTE.map((t: string) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipo && <p className="text-xs text-destructive">{errors.tipo.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Descripcion (opcional)</Label>
            <Input {...register("descripcion")} />
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
