import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/shared/state/auth.store";
import { documentosKeys } from "../model/queryKeys";
import { desvincularDocumento } from "./api";

export function useDesvincularDocumento(
  entidadTipo: string,
  entidadId: number,
  onSuccess?: () => void
) {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (vinculoId: number) =>
      desvincularDocumento(vinculoId, user?.email ?? "sistema"),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: documentosKeys.entity(entidadTipo, entidadId),
      });
      toast.success("Documento desvinculado");
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Error al desvincular el documento");
    },
  });
}
