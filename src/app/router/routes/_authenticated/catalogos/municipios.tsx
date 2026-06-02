import { createFileRoute } from "@tanstack/react-router"
import { MunicipiosPage } from "@/features/catalogos/municipios/listar/ui/MunicipiosPage"

export const Route = createFileRoute("/_authenticated/catalogos/municipios")({
  component: MunicipiosPage,
  head: () => ({
    meta: [{ title: "Municipios | Catalogos" }],
  }),
})
