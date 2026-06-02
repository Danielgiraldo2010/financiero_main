import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearUESchema, type CrearUEForm } from "../schema"
import { useCrearUnidadEjecutora } from "../hook"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  open: boolean
  onClose: () => void
}

export function UnidadEjecutoraFormDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useCrearUnidadEjecutora()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CrearUEForm>({
    resolver: zodResolver(crearUESchema),
    defaultValues: { codigo: "", nombre: "", nivel: 1, padreId: null },
  })

  function onSubmit(data: CrearUEForm) {
    mutate(
      { ...data, padreId: data.padreId ?? null },
      {
        onSuccess: () => {
          reset()
          onClose()
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Unidad Ejecutora</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Codigo</Label>
            <Input {...register("codigo")} placeholder="Ej: FCINGE" />
            {errors.codigo && (
              <p className="text-xs text-destructive">{errors.codigo.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="Nombre de la UE" />
            {errors.nombre && (
              <p className="text-xs text-destructive">{errors.nombre.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Nivel</Label>
            <Input type="number" {...register("nivel")} />
            {errors.nivel && (
              <p className="text-xs text-destructive">{errors.nivel.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>ID Unidad Superior (opcional)</Label>
            <Input type="number" {...register("padreId")} placeholder="Dejar vacio si es raiz" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
