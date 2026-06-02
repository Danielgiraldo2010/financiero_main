import { createFileRoute } from "@tanstack/react-router"
import { FuentesRecursosPage } from "@/features/catalogos/fuentes-recursos/listar/ui/FuentesRecursosPage"

export const Route = createFileRoute("/_authenticated/catalogos/fuentes-recursos")({
  component: FuentesRecursosPage,
  head: () => ({
    meta: [{ title: "Fuentes de Recursos | Catalogos" }],
  }),
})
