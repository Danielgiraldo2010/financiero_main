import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/shared/ui/modal/Dialog";
import { FormField } from "@/shared/ui/forms/FormField";
import { Input } from "@/shared/ui/primitives/input";
import { Button } from "@/shared/ui/primitives/button";
import { LoadingSpinner } from "@/shared/ui/feedback/LoadingSpinner";
import { useDocumento } from "../../detail/hook";
import { useActualizarDocumento } from "../hook";
import { actualizarDocumentoSchema, type ActualizarDocumentoValues } from "../schema";
import { TIPOS_DOCUMENTO } from "../../shared/constants";

interface Props {
  documentoId: number;
  open: boolean;
  onClose: () => void;
}

export default function ActualizarDocumentoDialog({ documentoId, open, onClose }: Props) {
  const { data: doc, isLoading } = useDocumento(documentoId);
  const mutation = useActualizarDocumento(documentoId, onClose);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActualizarDocumentoValues>({
    resolver: zodResolver(actualizarDocumentoSchema),
  });

  useEffect(() => {
    if (doc) {
      reset({
        nombre: doc.nombre,
        descripcion: doc.descripcion,
        tipoDocumento: doc.tipoDocumento as (typeof TIPOS_DOCUMENTO)[number],
        vigencia: doc.vigencia,
        esPublico: doc.esPublico,
      });
    }
  }, [doc, reset]);

  const onSubmit: SubmitHandler<ActualizarDocumentoValues> = (values) =>
    mutation.mutate(values);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Editar metadatos del documento"
      description="Modifica la información del documento sin reemplazar el archivo."
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Nombre"
            {...(errors.nombre?.message ? { error: errors.nombre.message } : {})}
          >
            <Input {...register("nombre")} />
          </FormField>

          <FormField
            label="Tipo de documento"
            {...(errors.tipoDocumento?.message ? { error: errors.tipoDocumento.message } : {})}
          >
            <select
              {...register("tipoDocumento")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {TIPOS_DOCUMENTO.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Descripción"
            {...(errors.descripcion?.message ? { error: errors.descripcion.message } : {})}
          >
            <textarea
              {...register("descripcion")}
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Vigencia (días)"
              {...(errors.vigencia?.message ? { error: errors.vigencia.message } : {})}
            >
              <Input type="number" {...register("vigencia")} />
            </FormField>

            <FormField label="Visibilidad">
              <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
                <input type="checkbox" {...register("esPublico")} className="rounded" />
                Documento público
              </label>
            </FormField>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
