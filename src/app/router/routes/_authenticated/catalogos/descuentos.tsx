import { createFileRoute } from "@tanstack/react-router"
import { DescuentosPage } from "@/features/catalogos/descuentos/listar/ui/DescuentosPage"

export const Route = createFileRoute("/_authenticated/catalogos/descuentos")({
  component: DescuentosPage,
  head: () => ({
    meta: [{ title: "Descuentos | Catalogos" }],
  }),
})
