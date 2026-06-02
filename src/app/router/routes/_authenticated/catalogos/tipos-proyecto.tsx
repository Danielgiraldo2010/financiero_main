import { createFileRoute } from "@tanstack/react-router"
import { TiposProyectoPage } from "@/features/catalogos/tipos-proyecto/listar/ui/TiposProyectoPage"

export const Route = createFileRoute("/_authenticated/catalogos/tipos-proyecto")({
  component: TiposProyectoPage,
  head: () => ({
    meta: [{ title: "Tipos de Proyecto | Catalogos" }],
  }),
})
