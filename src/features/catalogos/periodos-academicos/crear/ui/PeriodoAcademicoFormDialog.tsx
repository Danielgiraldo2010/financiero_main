import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearPeriodoSchema, type CrearPeriodoForm } from "../schema"
import { useCrearPeriodoAcademico } from "../hook"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props { open: boolean; onClose: () => void }

export function PeriodoAcademicoFormDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useCrearPeriodoAcademico()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CrearPeriodoForm>({
    resolver: zodResolver(crearPeriodoSchema),
    defaultValues: { vigencia: new Date().getFullYear(), periodo: 1, nombre: "", fechaInicio: "", fechaFin: "" },
  })

  function onSubmit(data: CrearPeriodoForm) {
    mutate(data, { onSuccess: () => { reset(); onClose() } })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Nuevo Periodo Academico</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label>Vigencia</Label>
              <Input type="number" {...register("vigencia")} />
              {errors.vigencia && <p className="text-xs text-destructive">{errors.vigencia.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Periodo</Label>
              <Input type="number" min={1} max={2} {...register("periodo")} />
              {errors.periodo && <p className="text-xs text-destructive">{errors.periodo.message}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="Ej: Semestre 2026-1" />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label>Fecha Inicio</Label>
              <Input type="date" {...register("fechaInicio")} />
              {errors.fechaInicio && <p className="text-xs text-destructive">{errors.fechaInicio.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Fecha Fin</Label>
              <Input type="date" {...register("fechaFin")} />
              {errors.fechaFin && <p className="text-xs text-destructive">{errors.fechaFin.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
