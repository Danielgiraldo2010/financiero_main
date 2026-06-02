import { createFileRoute } from "@tanstack/react-router"
import { NormatividadPage } from "@/features/normatividad"

export const Route = createFileRoute("/_authenticated/normatividad/normas")({
  staticData: { breadcrumb: "Normas" },
  component: NormatividadPage,
})
