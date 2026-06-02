import { createFileRoute } from "@tanstack/react-router"
import { ConceptosNominaPage } from "@/features/catalogos/conceptos-nomina/listar/ui/ConceptosNominaPage"

export const Route = createFileRoute("/_authenticated/catalogos/conceptos-nomina")({
  component: ConceptosNominaPage,
  head: () => ({
    meta: [{ title: "Conceptos Nomina | Catalogos" }],
  }),
})
