// iniciar/hook.ts
// useIniciarPresupuesto — inicia borrador e invalida proyecto + presupuesto.

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { presupuestoProyectoKeys } from "../model/queryKeys"
import { proyectosKeys } from "@/features/proyectos/model/queryKeys"
import { iniciarBorrador, type IniciarBorradorPayload } from "./api"

export function useIniciarPresupuesto(proyectoId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IniciarBorradorPayload) =>
      iniciarBorrador(proyectoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: presupuestoProyectoKeys.detail(proyectoId),
      })
      queryClient.invalidateQueries({
        queryKey: proyectosKeys.detail(proyectoId),
      })
      toast.success("Borrador de presupuesto iniciado")
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Error al iniciar el borrador")
    },
  })
}
