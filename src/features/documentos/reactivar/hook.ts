import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/shared/state/auth.store";
import { documentosKeys } from "../model/queryKeys";
import { reactivarDocumento } from "./api";

export function useReactivarDocumento(onSuccess?: () => void) {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (id: number) =>
      reactivarDocumento(id, user?.email ?? "sistema"),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: documentosKeys.searches() });
      qc.invalidateQueries({ queryKey: documentosKeys.detail(id) });
      toast.success("Documento reactivado");
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Error al reactivar el documento");
    },
  });
}
