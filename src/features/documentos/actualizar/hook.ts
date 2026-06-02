import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/shared/state/auth.store";
import { documentosKeys } from "../model/queryKeys";
import { actualizarDocumento } from "./api";
import type { ActualizarDocumentoValues } from "./schema";

export function useActualizarDocumento(id: number, onSuccess?: () => void) {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (values: ActualizarDocumentoValues) =>
      actualizarDocumento(id, {
        nombre: values.nombre,
        descripcion: values.descripcion,
        tipoDocumento: values.tipoDocumento,
        vigencia: values.vigencia,
        esPublico: values.esPublico,
        modificadoPor: user?.email ?? "sistema",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: documentosKeys.searches() });
      qc.invalidateQueries({ queryKey: documentosKeys.detail(id) });
      toast.success("Documento actualizado");
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Error al actualizar el documento");
    },
  });
}
