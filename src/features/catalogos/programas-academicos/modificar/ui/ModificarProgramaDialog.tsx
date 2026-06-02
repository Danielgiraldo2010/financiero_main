import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modificarProgramaSchema, type ModificarProgramaForm } from "../schema"
import { useModificarProgramaAcademico } from "../hook"
import type { ProgramaAcademicoResponse } from "../../../model/types"
import { NIVELES_PROGRAMA } from "../../../shared/constants"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props { open: boolean; onClose: () => void; item: ProgramaAcademicoResponse }

export function ModificarProgramaDialog({ open, onClose, item }: Props) {
  const { mutate, isPending } = useModificarProgramaAcademico()
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ModificarProgramaForm>({
    resolver: zodResolver(modificarProgramaSchema),
    defaultValues: { codigo: item.codigo, nombre: item.nombre, nivel: item.nivel, facultadId: item.facultadId ?? 0 },
  })
  useEffect(() => {
    if (open) reset({ codigo: item.codigo, nombre: item.nombre, nivel: item.nivel, facultadId: item.facultadId ?? 0 })
  }, [open, item, reset])
  function onSubmit(data: ModificarProgramaForm) {
    mutate({ id: item.id, ...data }, { onSuccess: () => { reset(); onClose() } })
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Programa Academico</DialogTitle></DialogHeader>
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
            <Label>Nivel</Label>
            <Controller
              control={control}
              name="nivel"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(v: string | null) => field.onChange(v ?? "")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {NIVELES_PROGRAMA.map((n: string) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.nivel && <p className="text-xs text-destructive">{errors.nivel.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>ID Facultad</Label>
            <Input type="number" {...register("facultadId")} />
            {errors.facultadId && <p className="text-xs text-destructive">{errors.facultadId.message}</p>}
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
