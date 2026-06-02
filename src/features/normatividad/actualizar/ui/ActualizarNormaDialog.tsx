import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { useActualizarNorma } from "../hook"
import { actualizarNormaSchema, type ActualizarNormaForm } from "../../model/schema"
import { TIPOS_NORMA, AMBITOS_NORMA } from "../../model/constants"
import type { NormaResponse } from "../../model/types"

interface Props {
  norma: NormaResponse
  open: boolean
  onClose: () => void
}

export function ActualizarNormaDialog({ norma, open, onClose }: Props) {
  const { mutate, isPending } = useActualizarNorma()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActualizarNormaForm>({
    resolver: zodResolver(actualizarNormaSchema),
    defaultValues: {
      codigo: norma.codigo,
      tipo: norma.tipo,
      ambito: norma.ambito,
      titulo: norma.titulo,
      descripcion: norma.descripcion ?? null,
      entidadEmisora: norma.entidadEmisora ?? null,
      fechaExpedicion: norma.fechaExpedicion ?? null,
      fechaVigenciaDesde: norma.fechaVigenciaDesde ?? null,
      fechaVigenciaHasta: norma.fechaVigenciaHasta ?? null,
      urlDocumento: norma.urlDocumento ?? null,
    },
  })

  function onSubmit(data: ActualizarNormaForm) {
    mutate(
      {
        id: norma.id,
        body: {
          ...data,
          descripcion: data.descripcion ?? null,
          entidadEmisora: data.entidadEmisora ?? null,
          fechaExpedicion: data.fechaExpedicion ?? null,
          fechaVigenciaDesde: data.fechaVigenciaDesde ?? null,
          fechaVigenciaHasta: data.fechaVigenciaHasta ?? null,
          urlDocumento: data.urlDocumento ?? null,
        },
      },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Editar norma" maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Codigo</label>
            <input className="input w-full" {...register("codigo")} />
            {errors.codigo && <p className="text-xs text-destructive mt-0.5">{errors.codigo.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Entidad emisora</label>
            <input className="input w-full" {...register("entidadEmisora")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select className="input w-full" {...register("tipo")}>
              {TIPOS_NORMA.map((t: string) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ambito</label>
            <select className="input w-full" {...register("ambito")}>
              {AMBITOS_NORMA.map((a: string) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Titulo</label>
          <input className="input w-full" {...register("titulo")} />
          {errors.titulo && <p className="text-xs text-destructive mt-0.5">{errors.titulo.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripcion</label>
          <textarea className="input w-full" rows={2} {...register("descripcion")} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha expedicion</label>
            <input type="date" className="input w-full" {...register("fechaExpedicion")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vigencia desde</label>
            <input type="date" className="input w-full" {...register("fechaVigenciaDesde")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vigencia hasta</label>
            <input type="date" className="input w-full" {...register("fechaVigenciaHasta")} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL del documento</label>
          <input type="url" className="input w-full" {...register("urlDocumento")} />
          {errors.urlDocumento && (
            <p className="text-xs text-destructive mt-0.5">{errors.urlDocumento.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? "Guardando..." : "Actualizar"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
