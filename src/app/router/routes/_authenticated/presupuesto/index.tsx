// app/router/routes/_authenticated/presupuesto/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { PresupuestoIndexPage } from '@/features/presupuesto'

export const Route = createFileRoute('/_authenticated/presupuesto/')({
  component: PresupuestoIndexPage,
  staticData: { breadcrumb: 'Presupuesto' },
})
