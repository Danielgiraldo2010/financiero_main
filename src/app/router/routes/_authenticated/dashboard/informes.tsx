import { createFileRoute } from "@tanstack/react-router"
import { InformesPage } from "@/features/dashboard/informes/ui/InformesPage"

export const Route = createFileRoute("/_authenticated/dashboard/informes")({
  component: InformesPage,
})
