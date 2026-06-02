import { fetcher } from "@/shared/api/fetcher"
import type { CrearEventoCommand } from "../model/types"

export const crearEventoAgenda = (body: CrearEventoCommand): Promise<number> =>
  fetcher("/api/v1/agenda", { method: "POST", body: JSON.stringify(body) })
