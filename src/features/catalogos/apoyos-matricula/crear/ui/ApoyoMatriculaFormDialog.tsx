import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearApoyoSchema, type CrearApoyoForm } from "../schema"
import { useCrearApoyoMatricula } from "../hook"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props { open: boolean; onClose: () => void }

export function ApoyoMatriculaFormDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useCrearApoyoMatricula()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CrearApoyoForm>({
    resolver: zodResolver(crearApoyoSchema),
    defaultValues: { codigo: "", nombre: "", tipo: "", rubroIngresoId: 0 },
  })
  function onSubmit(data: CrearApoyoForm) {
    mutate(data, { onSuccess: () => { reset(); onClose() } })
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Nuevo Apoyo de Matricula</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1"><Label>Codigo</Label><Input {...register("codigo")} />{errors.codigo && <p className="text-xs text-destructive">{errors.codigo.message}</p>}</div>
          <div className="flex flex-col gap-1"><Label>Nombre</Label><Input {...register("nombre")} />{errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}</div>
          <div className="flex flex-col gap-1"><Label>Tipo</Label><Input {...register("tipo")} />{errors.tipo && <p className="text-xs text-destructive">{errors.tipo.message}</p>}</div>
          <div className="flex flex-col gap-1"><Label>ID Rubro Ingreso</Label><Input type="number" {...register("rubroIngresoId")} />{errors.rubroIngresoId && <p className="text-xs text-destructive">{errors.rubroIngresoId.message}</p>}</div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}