import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { documentosKeys } from "../model/queryKeys";
import { vincularDocumento } from "./api";
import type { VincularDocumentoRequest } from "../model/types";

export function useVincularDocumento(entidadTipo: string, entidadId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentoId,
      request,
    }: {
      documentoId: number;
      request: VincularDocumentoRequest;
    }) => vincularDocumento(documentoId, request),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: documentosKeys.entity(entidadTipo, entidadId),
      });
      toast.success("Documento vinculado correctamente");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Error al vincular el documento");
    },
  });
}
