import { createFileRoute } from "@tanstack/react-router"
import { ProgramasAcademicosPage } from "@/features/catalogos/programas-academicos/listar/ui/ProgramasAcademicosPage"

export const Route = createFileRoute("/_authenticated/catalogos/programas-academicos")({
  component: ProgramasAcademicosPage,
  head: () => ({
    meta: [{ title: "Programas Academicos | Catalogos" }],
  }),
})
