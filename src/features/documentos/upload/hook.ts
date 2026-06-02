import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/shared/api/errors/ApiError";
import { documentosKeys } from "../model/queryKeys";
import { subirDocumento } from "./api";
import type { SubirDocumentoValues } from "./schema";

export function useSubirDocumento(onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (values: SubirDocumentoValues) => subirDocumento(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: documentosKeys.searches() });
      toast.success("Documento subido correctamente");
      onSuccess?.();
    },
    onError: (err: unknown) => {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Error al subir el documento";
      toast.error(message, { duration: 6000 });
    },
  });
}