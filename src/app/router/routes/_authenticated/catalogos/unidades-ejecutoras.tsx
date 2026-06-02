import { createFileRoute } from "@tanstack/react-router"
import { UnidadesEjecutorasPage } from "@/features/catalogos/unidades-ejecutoras/listar/ui/UnidadesEjecutorasPage"

export const Route = createFileRoute("/_authenticated/catalogos/unidades-ejecutoras")({
  component: UnidadesEjecutorasPage,
  head: () => ({
    meta: [
      {
        title: "Unidades Ejecutoras | Catalogos",
      },
    ],
  }),
})
