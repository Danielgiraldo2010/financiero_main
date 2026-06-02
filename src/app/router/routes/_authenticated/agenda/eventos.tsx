import { createFileRoute } from "@tanstack/react-router"
import { EventosAgendaPage } from "@/features/agenda"

export const Route = createFileRoute("/_authenticated/agenda/eventos")({
  staticData: { breadcrumb: "Eventos" },
  component: EventosAgendaPage,
})
