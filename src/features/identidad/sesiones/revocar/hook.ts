import { useMutation, useQueryClient } from "@tanstack/react-query"
import { revocarSesion } from "./api"

export function useRevocarSesion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => revocarSesion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sesiones"] })
    },
  })
}
