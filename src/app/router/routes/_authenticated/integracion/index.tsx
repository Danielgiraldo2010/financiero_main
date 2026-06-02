// app/router/routes/_authenticated/integracion/index.tsx

import { createFileRoute } from "@tanstack/react-router"
import { IntegracionPage } from "@/features/integracion"

export const Route = createFileRoute("/_authenticated/integracion/")({
  component: IntegracionPage,
})
