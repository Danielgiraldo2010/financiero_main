import { createFileRoute } from "@tanstack/react-router"
import { AuthenticatedLayout } from "@/app/layouts/AuthenticatedLayout"

// Layout autenticado para todas las rutas bajo /_authenticated/
export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
})
