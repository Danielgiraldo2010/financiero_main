import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/shared/state/auth.store";
import { documentosKeys } from "../model/queryKeys";
import { eliminarDocumento } from "./api";

export function useEliminarDocumento(onSuccess?: () => void) {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (id: number) =>
      eliminarDocumento(id, user?.email ?? "sistema"),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: documentosKeys.searches() });
      qc.removeQueries({ queryKey: documentosKeys.detail(id) });
      toast.success("Documento eliminado");
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Error al eliminar el documento");
    },
  });
}
