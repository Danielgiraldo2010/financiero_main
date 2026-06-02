import { createFileRoute } from "@tanstack/react-router"
import { VigenciasPage } from "@/features/catalogos/vigencias/listar/ui/VigenciasPage"

export const Route = createFileRoute("/_authenticated/admin/vigencias")({
  component: VigenciasPage,
  head: () => ({
    meta: [
      {
        title: "Vigencias | Administración",
      },
    ],
  }),
})
