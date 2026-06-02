import { createFileRoute } from "@tanstack/react-router"
import { PeriodosAcademicosPage } from "@/features/catalogos/periodos-academicos/listar/ui/PeriodosAcademicosPage"

export const Route = createFileRoute("/_authenticated/catalogos/periodos-academicos")({
  component: PeriodosAcademicosPage,
  head: () => ({
    meta: [{ title: "Periodos Academicos | Catalogos" }],
  }),
})
