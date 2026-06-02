import { useQuery } from "@tanstack/react-query"
import { rolesKeys } from "../model/queryKeys"
import { fetchRol } from "./api"

export function useRol(id: string) {
  return useQuery({
    queryKey: rolesKeys.detail(id),
    queryFn: () => fetchRol(id),
    enabled: Boolean(id),
  })
}
