import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modificarRubroGastoSchema, type ModificarRubroGastoForm } from "../schema"
import { useModificarRubroGasto } from "../hook"
import type { RubroGastoResponse } from "../../../model/types"
import { TIPOS_GASTO } from "../../../shared/constants"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props { open: boolean; onClose: () => void; item: RubroGastoResponse }

export function ModificarRubroGastoDialog({ open, onClose, item }: Props) {
  const { mutate, isPending } = useModificarRubroGasto()
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ModificarRubroGastoForm>({
    resolver: zodResolver(modificarRubroGastoSchema),
    defaultValues: {
      codigoCcp: item.codigoCcp, nombre: item.nombre,
      tipoGasto: item.tipoGasto, clasificacionFunc: item.clasificacionFunc,
      estructuraId: item.estructuraId ?? null,
    },
  })
  useEffect(() => {
    if (open) reset({
      codigoCcp: item.codigoCcp, nombre: item.nombre,
      tipoGasto: item.tipoGasto, clasificacionFunc: item.clasificacionFunc,
      estructuraId: item.estructuraId ?? null,
    })
  }, [open, item, reset])
  function onSubmit(data: ModificarRubroGastoForm) {
    mutate({ id: item.id, ...data, estructuraId: data.estructuraId ?? null }, { onSuccess: () => { reset(); onClose() } })
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Rubro de Gasto</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Codigo CCP</Label>
            <Input {...register("codigoCcp")} />
            {errors.codigoCcp && <p className="text-xs text-destructive">{errors.codigoCcp.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Tipo de Gasto</Label>
            <Controller
              control={control}
              name="tipoGasto"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(v: string | null) => field.onChange(v ?? "")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_GASTO.map((t: string) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipoGasto && <p className="text-xs text-destructive">{errors.tipoGasto.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Clasificacion Funcional</Label>
            <Input {...register("clasificacionFunc")} />
            {errors.clasificacionFunc && <p className="text-xs text-destructive">{errors.clasificacionFunc.message}</p>}
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
