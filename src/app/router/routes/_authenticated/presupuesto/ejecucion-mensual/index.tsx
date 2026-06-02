// app/router/routes/_authenticated/presupuesto/ejecucion-mensual/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { EjecucionMensualPage } from '@/features/presupuesto'

export const Route = createFileRoute(
  '/_authenticated/presupuesto/ejecucion-mensual/',
)({
  component: EjecucionMensualPage,
  staticData: { breadcrumb: 'Ejecución Mensual' },
})
