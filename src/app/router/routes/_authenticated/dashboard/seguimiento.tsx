import { createFileRoute } from "@tanstack/react-router"
import { EventosSeguimientoPage } from "@/features/dashboard/seguimiento/listar/ui/EventosSeguimientoPage"

export const Route = createFileRoute("/_authenticated/dashboard/seguimiento")({
  component: EventosSeguimientoPage,
})
