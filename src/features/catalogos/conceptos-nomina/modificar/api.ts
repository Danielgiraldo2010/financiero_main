import { fetcher } from "@/shared/api/fetcher"
import type { ModificarConceptoCommand, ConceptoNominaResponse } from "../../model/types"
export function modificarConceptoNomina(cmd: ModificarConceptoCommand): Promise<ConceptoNominaResponse> {
  return fetcher(`/api/v1/catalogos/conceptos-nomina/${cmd.id}`, { method: "PUT", body: JSON.stringify(cmd) })
}