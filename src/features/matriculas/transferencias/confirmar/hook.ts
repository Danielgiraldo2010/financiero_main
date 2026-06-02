import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirmarRecepcion } from "./api"
import { matriculasKeys } from "../../model/queryKeys"
import type { TransferenciaInternaResponse } from "../../model/types"

/**
 * INVARIANTE I5: Optimistic update — bajo riesgo, reversible
 */
export function useConfirmarRecepcion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, valorRecibido, fechaGiro, observaciones }: {
      id: number
      valorRecibido: number
      fechaGiro: string
      observaciones?: string | null
    }) => confirmarRecepcion(id, { valorRecibido, fechaGiro, observaciones: observaciones ?? null }),

    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: matriculasKeys.transferencias() })
      const prev = qc.getQueryData(matriculasKeys.transferencias())
      qc.setQueriesData(
        { queryKey: matriculasKeys.transferencias() },
        (old: { items: TransferenciaInternaResponse[] } | undefined) =>
          old
            ? {
                ...old,
                items: old.items.map((t) =>
                  t.id === id ? { ...t, estado: "CONFIRMADO" } : t
                ),
              }
            : old
      )
      return { prev }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueriesData({ queryKey: matriculasKeys.transferencias() }, ctx.prev)
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: matriculasKeys.transferencias() })
    },
  })
}
