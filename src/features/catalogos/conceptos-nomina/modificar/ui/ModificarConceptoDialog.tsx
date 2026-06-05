import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modificarConceptoSchema, type ModificarConceptoForm } from "../schema"
import { useModificarConceptoNomina } from "../hook"
import type { ConceptoNominaResponse } from "../../../model/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props { open: boolean; onClose: () => void; item: ConceptoNominaResponse }

export function ModificarConceptoDialog({ open, onClose, item }: Props) {
  const { mutate, isPending } = useModificarConceptoNomina()
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ModificarConceptoForm>({
    resolver: zodResolver(modificarConceptoSchema),
    defaultValues: {
      codigo: item.codigo, nombre: item.nombre, tipo: item.tipo,
      rubroGastoId: item.rubroGastoId ?? null,
      esFactorSalarial: item.esFactorSalarial,
      porcentajeAplicacion: item.porcentajeAplicacion ?? null,
      orden: item.orden,
    },
  })
  useEffect(() => {
    if (open) reset({
      codigo: item.codigo, nombre: item.nombre, tipo: item.tipo,
      rubroGastoId: item.rubroGastoId ?? null,
      esFactorSalarial: item.esFactorSalarial,
      porcentajeAplicacion: item.porcentajeAplicacion ?? null,
      orden: item.orden,
    })
  }, [open, item, reset])
  function onSubmit(data: ModificarConceptoForm) {
    mutate({
      id: item.id, codigo: data.codigo, nombre: data.nombre, tipo: data.tipo,
      rubroGastoId: data.rubroGastoId ?? null,
      esFactorSalarial: data.esFactorSalarial,
      porcentajeAplicacion: data.porcentajeAplicacion ?? null,
      orden: data.orden,
    }, { onSuccess: () => { reset(); onClose() } })
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Concepto de Nomina</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label>Codigo</Label>
              <Input {...register("codigo")} />
              {errors.codigo && <p className="text-xs text-destructive">{errors.codigo.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Tipo</Label>
              <Input {...register("tipo")} />
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
            <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
