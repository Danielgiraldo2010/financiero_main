import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearRubroIngresoSchema, type CrearRubroIngresoForm } from "../schema"
import { useCrearRubroIngreso } from "../hook"
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

export function RubroIngresoFormDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useCrearRubroIngreso()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CrearRubroIngresoForm>({
    resolver: zodResolver(crearRubroIngresoSchema),
    defaultValues: { codigoCicp: "", nombre: "", categoria: "", subcategoria: null, estructuraId: null },
  })

  function onSubmit(data: CrearRubroIngresoForm) {
    mutate(
      {
        codigoCicp: data.codigoCicp,
        nombre: data.nombre,
        categoria: data.categoria,
        subcategoria: data.subcategoria ?? null,
        estructuraId: data.estructuraId ?? null,
      },
      { onSuccess: () => { reset(); onClose() } },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Rubro de Ingreso</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Codigo CICP</Label>
            <Input {...register("codigoCicp")} placeholder="Ej: 1.1.01" />
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
            <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
