import { useQuery } from "@tanstack/react-query"
import { fetchSesiones } from "./api"

export function useSesiones() {
  return useQuery({
    queryKey: ["sesiones"],
    queryFn: fetchSesiones,
  })
}
