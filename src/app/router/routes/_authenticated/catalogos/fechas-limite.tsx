import { createFileRoute } from "@tanstack/react-router"
import { FechasLimitePage } from "@/features/catalogos/fechas-limite/listar/ui/FechasLimitePage"

export const Route = createFileRoute("/_authenticated/catalogos/fechas-limite")({
  component: FechasLimitePage,
  head: () => ({
    meta: [{ title: "Fechas Limite | Catalogos" }],
  }),
})
