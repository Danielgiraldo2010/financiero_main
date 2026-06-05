import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearFechaLimiteSchema, type CrearFechaLimiteForm } from "../schema"
import { useCrearFechaLimite } from "../hook"
import { TIPOS_LIMITE } from "../../../shared/constants"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Controller } from "react-hook-form"

interface Props { open: boolean; onClose: () => void }

export function FechaLimiteFormDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useCrearFechaLimite()
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CrearFechaLimiteForm>({
    resolver: zodResolver(crearFechaLimiteSchema),
    defaultValues: {
      vigencia: new Date().getFullYear(),
      tipoLimite: "",
      nombre: "",
      fechaLimite: "",
      fechaRecordatorio: null,
      diasAnticipacion: null,
      descripcion: null,
      unidadEjecutoraId: null,
    },
  })

  function onSubmit(data: CrearFechaLimiteForm) {
    mutate(
      {
        ...data,
        fechaRecordatorio: data.fechaRecordatorio ?? null,
        diasAnticipacion: data.diasAnticipacion ?? null,
        descripcion: data.descripcion ?? null,
        unidadEjecutoraId: data.unidadEjecutoraId ?? null,
      },
      { onSuccess: () => { reset(); onClose() } },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Nueva Fecha Limite</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label>Vigencia</Label>
              <Input type="number" {...register("vigencia")} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Tipo Limite</Label>
              <Controller
                control={control}
                name="tipoLimite"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => field.onChange(v ?? "")}>
                    <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                    <SelectContent>
                      {TIPOS_LIMITE.map((t: string) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipoLimite && <p className="text-xs text-destructive">{errors.tipoLimite.message}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label>Fecha Limite</Label>
              <Input type="date" {...register("fechaLimite")} />
              {errors.fechaLimite && <p className="text-xs text-destructive">{errors.fechaLimite.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Recordatorio (opcional)</Label>
              <Input type="date" {...register("fechaRecordatorio")} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label>Dias anticipacion</Label>
              <Input type="number" {...register("diasAnticipacion")} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>UE (opcional)</Label>
              <Input type="number" {...register("unidadEjecutoraId")} placeholder="ID UE" />
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
