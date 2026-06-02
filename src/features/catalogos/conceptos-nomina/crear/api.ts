import { fetcher } from "@/shared/api/fetcher"
import type { CrearConceptoCommand, ConceptoNominaResponse } from "../../model/types"
export function crearConceptoNomina(cmd: CrearConceptoCommand): Promise<ConceptoNominaResponse> {
  return fetcher("/api/v1/catalogos/conceptos-nomina", { method: "POST", body: JSON.stringify(cmd) })
}