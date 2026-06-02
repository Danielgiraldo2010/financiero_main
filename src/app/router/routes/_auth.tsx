import { createFileRoute } from "@tanstack/react-router"
import { PublicLayout } from "@/app/layouts/PublicLayout"

// Layout publico para rutas no autenticadas: /login, /register, etc.
export const Route = createFileRoute("/_auth")({
  component: PublicLayout,
})
