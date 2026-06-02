import { createFileRoute } from "@tanstack/react-router"
import { RubrosIngresoPage } from "@/features/catalogos/rubros-ingreso/listar/ui/RubrosIngresoPage"

export const Route = createFileRoute("/_authenticated/catalogos/rubros-ingreso")({
  component: RubrosIngresoPage,
  head: () => ({
    meta: [{ title: "Rubros de Ingreso | Catalogos" }],
  }),
})
