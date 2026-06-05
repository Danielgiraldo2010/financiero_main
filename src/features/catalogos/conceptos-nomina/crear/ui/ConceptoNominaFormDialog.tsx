import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearConceptoSchema, type CrearConceptoForm } from "../schema"
import { useCrearConceptoNomina } from "../hook"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props { open: boolean; onClose: () => void }

export function ConceptoNominaFormDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useCrearConceptoNomina()
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CrearConceptoForm>({
    resolver: zodResolver(crearConceptoSchema),
    defaultValues: { codigo: "", nombre: "", tipo: "", rubroGastoId: null, esFactorSalarial: false, porcentajeAplicacion: null, orden: 1 },
  })
  function onSubmit(data: CrearConceptoForm) {
    mutate({
      codigo: data.codigo, nombre: data.nombre, tipo: data.tipo,
      rubroGastoId: data.rubroGastoId ?? null,
      esFactorSalarial: data.esFactorSalarial,
      porcentajeAplicacion: data.porcentajeAplicacion ?? null,
      orden: data.orden,
    }, { onSuccess: () => { reset(); onClose() } })
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Nuevo Concepto de Nomina</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label>Codigo</Label>
              <Input {...register("codigo")} />
              {errors.codigo && <p className="text-xs text-destructive">{errors.codigo.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Tipo</Label>
              <Input {...register("tipo")} placeholder="DEVENGO, DEDUCCION..." />
              {errors.tipo && <p className="text-xs text-destructive">{errors.tipo.message}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label>Orden</Label>
              <Input type="number" {...register("orden")} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>% Aplicacion</Label>
              <Input type="number" step="0.01" {...register("porcentajeAplicacion")} />
            </div>
          </div>
          <Controller
            control={control}
            name="esFactorSalarial"
            render={({ field }) => (
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-primary"
                  checked={field.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                />
                Es factor salarial
              </label>
            )}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
