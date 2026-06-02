import { createFileRoute } from "@tanstack/react-router"
import { MiAgendaPage } from "@/features/agenda"

export const Route = createFileRoute("/_authenticated/agenda/mi-agenda")({
  staticData: { breadcrumb: "Mi Agenda" },
  component: MiAgendaPage,
})
