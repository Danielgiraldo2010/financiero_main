import { createFileRoute } from "@tanstack/react-router"
import { ApoyosMatriculaPage } from "@/features/catalogos/apoyos-matricula/listar/ui/ApoyosMatriculaPage"

export const Route = createFileRoute("/_authenticated/catalogos/apoyos-matricula")({
  component: ApoyosMatriculaPage,
  head: () => ({
    meta: [{ title: "Apoyos Matricula | Catalogos" }],
  }),
})
