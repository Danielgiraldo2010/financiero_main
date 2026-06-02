import { fetcher } from "@/shared/api/fetcher"
import type { CrearNormaCommand } from "../model/types"

export const registrarNorma = (body: CrearNormaCommand): Promise<number> =>
  fetcher("/api/v1/normatividad", { method: "POST", body: JSON.stringify(body) })
