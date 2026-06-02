import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearRubroGastoSchema, type CrearRubroGastoForm } from "../schema"
import { useCrearRubroGasto } from "../hook"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props { open: boolean; onClose: () => void }

export function RubroGastoFormDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useCrearRubroGasto()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CrearRubroGastoForm>({
    resolver: zodResolver(crearRubroGastoSchema),
    defaultValues: { codigoCcp: "", nombre: "", tipoGasto: "", clasificacionFunc: "", estructuraId: null },
  })

  function onSubmit(data: CrearRubroGastoForm) {
    mutate(
      { ...data, estructuraId: data.estructuraId ?? null },
      { onSuccess: () => { reset(); onClose() } },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Nuevo Rubro de Gasto</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Codigo CCP</Label>
            <Input {...register("codigoCcp")} placeholder="Ej: 2.1.01" />
            {errors.codigoCcp && <p className="text-xs text-destructive">{errors.codigoCcp.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Tipo de Gasto</Label>
            <Input {...register("tipoGasto")} placeholder="PERSONAL, GENERALES..." />
            {errors.tipoGasto && <p className="text-xs text-destructive">{errors.tipoGasto.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Clasificacion Funcional</Label>
            <Input {...register("clasificacionFunc")} />
            {errors.clasificacionFunc && <p className="text-xs text-destructive">{errors.clasificacionFunc.message}</p>}
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
