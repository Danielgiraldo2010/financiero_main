import { createFileRoute } from "@tanstack/react-router"
import { RubrosGastoPage } from "@/features/catalogos/rubros-gasto/listar/ui/RubrosGastoPage"

export const Route = createFileRoute("/_authenticated/catalogos/rubros-gasto")({
  component: RubrosGastoPage,
  head: () => ({
    meta: [{ title: "Rubros de Gasto | Catalogos" }],
  }),
})
