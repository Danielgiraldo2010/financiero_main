import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRegistrarNorma } from "../hook"
import { crearNormaSchema, type CrearNormaForm } from "../../model/schema"
import { TIPOS_NORMA, AMBITOS_NORMA } from "../../model/constants"

interface Props {
  open: boolean
  onClose: () => void
}

const labelClass = "block text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-1"
const selectClass =
  "h-11 w-full rounded-[12px] border border-[#d1d5db] bg-white px-3.5 text-sm text-[#1f2937] shadow-sm outline-none transition-all hover:border-[#004b82] focus:border-[#0a4f82] focus:ring-4 focus:ring-[#0a4f82]/12"
const errorClass = "mt-1 text-xs text-destructive"

export function RegistrarNormaDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useRegistrarNorma()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CrearNormaForm>({
    resolver: zodResolver(crearNormaSchema),
  })

  function onSubmit(data: CrearNormaForm) {
    mutate(
      {
        ...data,
        descripcion: data.descripcion ?? null,
        entidadEmisora: data.entidadEmisora ?? null,
        fechaExpedicion: data.fechaExpedicion ?? null,
        fechaVigenciaDesde: data.fechaVigenciaDesde ?? null,
        fechaVigenciaHasta: data.fechaVigenciaHasta ?? null,
        urlDocumento: data.urlDocumento ?? null,
        procesos: [],
      },
      { onSuccess: () => { reset(); onClose() } }
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Registrar norma" maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

        {/* Fila 1: Código + Entidad emisora */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Código <span className="text-destructive">*</span></label>
            <Input {...register("codigo")} placeholder="Ej: Acuerdo-44-2017" aria-invalid={!!errors.codigo} />
            {errors.codigo && <p className={errorClass}>{errors.codigo.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Entidad emisora</label>
            <Input {...register("entidadEmisora")} placeholder="Ej: Congreso de la República" />
          </div>
        </div>

        {/* Fila 2: Tipo + Ámbito */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Tipo <span className="text-destructive">*</span></label>
            <select className={selectClass} {...register("tipo")}>
              <option value="">Seleccione...</option>
              {TIPOS_NORMA.map((t: string) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.tipo && <p className={errorClass}>{errors.tipo.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Ámbito <span className="text-destructive">*</span></label>
            <select className={selectClass} {...register("ambito")}>
              <option value="">Seleccione...</option>
              {AMBITOS_NORMA.map((a: string) => <option key={a} value={a}>{a}</option>)}
            </select>
            {errors.ambito && <p className={errorClass}>{errors.ambito.message}</p>}
          </div>
        </div>

        {/* Título */}
        <div>
          <label className={labelClass}>Título <span className="text-destructive">*</span></label>
          <Input {...register("titulo")} placeholder="Título completo de la norma" aria-invalid={!!errors.titulo} />
          {errors.titulo && <p className={errorClass}>{errors.titulo.message}</p>}
        </div>

        {/* Descripción */}
        <div>
          <label className={labelClass}>Descripción</label>
          <textarea
            {...register("descripcion")}
            rows={2}
            className="w-full rounded-[12px] border border-[#d1d5db] bg-white px-3.5 py-2.5 text-sm text-[#1f2937] shadow-sm outline-none transition-all placeholder:text-[#6b7280] hover:border-[#004b82] focus:border-[#0a4f82] focus:ring-4 focus:ring-[#0a4f82]/12 resize-none"
          />
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Fecha expedición</label>
            <Input type="date" {...register("fechaExpedicion")} />
          </div>
          <div>
            <label className={labelClass}>Vigencia desde</label>
            <Input type="date" {...register("fechaVigenciaDesde")} />
          </div>
          <div>
            <label className={labelClass}>Vigencia hasta</label>
            <Input type="date" {...register("fechaVigenciaHasta")} />
          </div>
        </div>

        {/* URL */}
        <div>
          <label className={labelClass}>URL del documento</label>
          <Input type="url" {...register("urlDocumento")} placeholder="https://..." aria-invalid={!!errors.urlDocumento} />
          {errors.urlDocumento && <p className={errorClass}>{errors.urlDocumento.message}</p>}
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Registrar norma"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
